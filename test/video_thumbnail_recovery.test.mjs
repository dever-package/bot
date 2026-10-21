import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

const frontRequire = createRequire(
  new URL("../front/package.json", import.meta.url),
);
const ts = frontRequire("typescript");
const thumbnailPath = new URL(
  "../front/src/nodes/shared/video-thumbnail.tsx",
  import.meta.url,
);
const firstFramePath = new URL(
  "../../../../front/src/components/media/first-frame-video.tsx",
  import.meta.url,
);
const mediaStates = { HAVE_METADATA: 1, HAVE_CURRENT_DATA: 2 };
const flush = () => new Promise((resolve) => setImmediate(resolve));

// 加载真实 owner，测试侧访问私有函数；不为测试增加生产导出或请求网络。
function sourceModule(path, bindings, expose = []) {
  const output = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const exports = {};
  runInNewContext(output + `\nObject.assign(exports, {${expose.join(",")}});`, {
    exports,
    Error,
    HTMLMediaElement: mediaStates,
    require(specifier) {
      if (specifier === "react")
        return { useRef: (value) => ({ current: value }) };
      if (specifier === "react/jsx-runtime")
        return { jsx: (type, props) => ({ type, props }) };
      if (specifier === "@/components/media/first-frame-video") return {};
      throw new Error(`unexpected dependency ${specifier}`);
    },
    ...bindings,
  });
  return exports;
}

class FakeVideo extends EventTarget {
  duration = 4;
  readyState = 0;
  videoWidth = 448;
  videoHeight = 576;
  seeking = false;
  cleaned = false;
  time = 0;
  get currentTime() {
    return this.time;
  }
  set currentTime(value) {
    this.time = value;
    this.seeking = true;
  }
  emit(type) {
    this.dispatchEvent(new Event(type));
  }
  load() {}
  pause() {}
  removeAttribute(name) {
    if (name === "src") this.cleaned = true;
  }
  metadata() {
    this.readyState = 1;
    this.emit("loadedmetadata");
  }
  frame() {
    this.readyState = 2;
    this.seeking = false;
    this.emit("seeked");
  }
}

function thumbnailFixture() {
  let now = 0;
  const videos = [];
  const draws = [];
  const api = sourceModule(
    thumbnailPath,
    {
      Date: class extends Date {
        static now() {
          return now;
        }
      },
      document: {
        createElement(tag) {
          if (tag === "video") {
            const video = new FakeVideo();
            videos.push(video);
            return video;
          }
          assert.equal(tag, "canvas");
          return {
            getContext: () => ({
              drawImage: (video) => draws.push(video.currentTime),
            }),
            toBlob: (callback) =>
              callback(new Blob(["frame"], { type: "image/jpeg" })),
          };
        },
      },
      window: { setTimeout: () => 1, clearTimeout() {} },
    },
    [
      "captureVideoThumbnail",
      "acquireCapturedVideoThumbnail",
      "rememberFailedURL",
      "isFailureCoolingDown",
      "failedCaptureURLs",
      "failedRemoteThumbnailURLs",
      "captureCache",
      "FAILURE_COOLDOWN_MS",
      "MAX_FAILURE_CACHE_SIZE",
    ],
  );
  return {
    api,
    videos,
    draws,
    advance: (milliseconds) => {
      now += milliseconds;
    },
  };
}

test("首帧截图等待 seek 完成与帧数据，保留比例并释放视频", async () => {
  const { api, videos, draws } = thumbnailFixture();
  const capture = api.captureVideoThumbnail("seek.mp4");
  const video = videos[0];
  video.metadata();
  video.readyState = 2;
  video.emit("loadeddata");
  assert.equal(draws.length, 0, "loadeddata during seeking must not capture");
  video.readyState = 1;
  video.seeking = false;
  video.emit("seeked");
  assert.equal(
    draws.length,
    0,
    "seeked without a decoded frame must not capture",
  );
  video.readyState = 2;
  video.emit("loadeddata");
  const result = await capture.promise;
  assert.equal(draws.length, 1);
  assert.equal(result.width, 448);
  assert.equal(result.height, 576);
  assert.equal(video.cleaned, true);
});

test("不可定位的流仍可提取当前首帧", async () => {
  const { api, videos, draws } = thumbnailFixture();
  const capture = api.captureVideoThumbnail("stream.mp4");
  const video = videos[0];
  video.duration = Infinity;
  video.metadata();
  video.readyState = 2;
  video.emit("loadeddata");
  await capture.promise;
  assert.equal(video.currentTime, 0);
  assert.equal(draws.length, 1);
});

test("失败冷却到期后恢复且缓存有容量上限", async () => {
  const { api, videos, advance } = thumbnailFixture();
  const capture = api.acquireCapturedVideoThumbnail("retry.mp4");
  videos[0].emit("error");
  await assert.rejects(capture.promise, /加载失败/);
  await flush();
  assert.equal(
    api.isFailureCoolingDown(api.failedCaptureURLs, "retry.mp4"),
    true,
  );
  await assert.rejects(api.acquireCapturedVideoThumbnail("retry.mp4").promise);
  assert.equal(videos.length, 1);
  advance(api.FAILURE_COOLDOWN_MS);
  const recovered = api.acquireCapturedVideoThumbnail("retry.mp4");
  assert.equal(videos.length, 2);
  videos[1].metadata();
  videos[1].frame();
  await recovered.promise;
  assert.equal(
    api.isFailureCoolingDown(api.failedCaptureURLs, "retry.mp4"),
    false,
  );
  for (let index = 0; index <= api.MAX_FAILURE_CACHE_SIZE; index += 1) {
    api.rememberFailedURL(api.failedRemoteThumbnailURLs, `poster-${index}.jpg`);
  }
  assert.equal(api.failedRemoteThumbnailURLs.size, api.MAX_FAILURE_CACHE_SIZE);
  assert.equal(
    api.isFailureCoolingDown(api.failedRemoteThumbnailURLs, "poster-0.jpg"),
    false,
  );
  advance(api.FAILURE_COOLDOWN_MS);
  assert.equal(
    api.isFailureCoolingDown(api.failedRemoteThumbnailURLs, "poster-1.jpg"),
    false,
  );
});

test("同源请求合并，最多两路截帧；取消最后一个消费者不记录失败", async () => {
  const { api, videos } = thumbnailFixture();
  const first = api.acquireCapturedVideoThumbnail("same.mp4");
  const duplicate = api.acquireCapturedVideoThumbnail("same.mp4");
  const second = api.acquireCapturedVideoThumbnail("second.mp4");
  const queued = api.acquireCapturedVideoThumbnail("third.mp4");
  assert.equal(first.promise, duplicate.promise);
  assert.equal(videos.length, 2);
  first.release();
  assert.equal(videos[0].cleaned, false);
  const aborted = assert.rejects(duplicate.promise, { name: "AbortError" });
  duplicate.release();
  await aborted;
  await flush();
  assert.equal(videos[0].cleaned, true);
  assert.equal(videos.length, 3);
  assert.equal(
    api.isFailureCoolingDown(api.failedCaptureURLs, "same.mp4"),
    false,
  );
  videos[1].metadata();
  videos[1].frame();
  videos[2].metadata();
  videos[2].frame();
  await Promise.all([second.promise, queued.promise]);
  await flush();
  const cached = await api.acquireCapturedVideoThumbnail("second.mp4").promise;
  assert.equal(cached, api.captureCache.get("second.mp4"));
  assert.equal(
    videos.length,
    3,
    "a cached success must not load the video again",
  );
});

test("队列中的离屏请求取消后不占用解码器，之后可以重新申请", async () => {
  const { api, videos } = thumbnailFixture();
  const first = api.acquireCapturedVideoThumbnail("first.mp4");
  const second = api.acquireCapturedVideoThumbnail("second.mp4");
  const queued = api.acquireCapturedVideoThumbnail("offscreen.mp4");
  const aborted = assert.rejects(queued.promise, { name: "AbortError" });
  queued.release();
  await aborted;
  assert.equal(videos.length, 2);
  assert.equal(
    api.isFailureCoolingDown(api.failedCaptureURLs, "offscreen.mp4"),
    false,
  );
  videos[0].metadata();
  videos[0].frame();
  videos[1].metadata();
  videos[1].frame();
  await Promise.all([first.promise, second.promise]);
  await flush();
  const reentered = api.acquireCapturedVideoThumbnail("offscreen.mp4");
  assert.equal(videos.length, 3);
  videos[2].metadata();
  videos[2].frame();
  await reentered.promise;
});

test("原生首帧通知不提前显示定位中、无数据或无尺寸的画面", () => {
  const { FirstFrameVideo } = sourceModule(firstFramePath);
  let ready = 0;
  const { props } = FirstFrameVideo({
    src: "native.mp4",
    onFirstFrameReady: () => (ready += 1),
  });
  const video = new FakeVideo();
  const event = { currentTarget: video };
  video.readyState = 1;
  props.onLoadedMetadata(event);
  video.readyState = 2;
  props.onLoadedData(event);
  assert.equal(ready, 0);
  video.seeking = false;
  video.readyState = 1;
  props.onSeeked(event);
  assert.equal(ready, 0);
  video.readyState = 2;
  video.videoWidth = 0;
  props.onSeeked(event);
  assert.equal(ready, 0);
  video.videoWidth = 448;
  props.onSeeked(event);
  props.onLoadedData(event);
  assert.equal(ready, 1);
});

test("原生流和带封面的视频不强制定位，正常播放不倒退", () => {
  const { FirstFrameVideo } = sourceModule(firstFramePath);
  for (const scenario of ["stream", "poster", "playing"]) {
    let ready = 0;
    const video = new FakeVideo();
    video.readyState = 2;
    if (scenario === "stream") video.duration = Infinity;
    if (scenario === "playing") video.time = 1.5;
    const { props } = FirstFrameVideo({
      src: `${scenario}.mp4`,
      poster: scenario === "poster" ? "poster.jpg" : undefined,
      onFirstFrameReady: () => (ready += 1),
    });
    props.onLoadedData({ currentTarget: video });
    assert.equal(video.currentTime, scenario === "playing" ? 1.5 : 0);
    assert.equal(ready, 1);
  }
});

test("素材封面失败后保留视频恢复入口，成功后清除失败；图片保持原行为", () => {
  const path = new URL(
    "../front/src/nodes/body-work/asset/asset-lazy-cover.tsx",
    import.meta.url,
  );
  for (const kind of ["video", "image"]) {
    const src = `${kind}.media`;
    const states = [src, "", ""];
    let cursor = 0;
    const videoThumbnail = () => {};
    const jsx = (type, props) => ({ type, props });
    const { AssetLazyCover } = sourceModule(path, {
      require(specifier) {
        if (specifier === "react") {
          return {
            useRef: () => ({ current: null }),
            useEffect() {},
            useState() {
              const index = cursor++;
              return [states[index], (value) => (states[index] = value)];
            },
          };
        }
        if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx };
        if (specifier === "../../shared/video-thumbnail") {
          return { VideoThumbnail: videoThumbnail };
        }
        throw new Error(`unexpected dependency ${specifier}`);
      },
    });
    function render() {
      cursor = 0;
      return AssetLazyCover({ kind, src });
    }
    let cover = render();
    const media = cover.props.children[0];
    media.props.onError();
    cover = render();
    assert.equal(cover.props.className.includes("is-failed"), true);
    assert.equal(cover.props.children[1].props.children, "封面加载失败");
    if (kind === "image") {
      assert.equal(cover.props.children[0], null);
      continue;
    }
    const recovering = cover.props.children[0];
    assert.equal(recovering.type, videoThumbnail);
    assert.equal(recovering.props.src, src);
    assert.equal(recovering.props.style.position, "absolute");
    assert.equal(recovering.props.style.inset, 0);
    recovering.props.onLoad();
    cover = render();
    assert.equal(cover.props.className.includes("is-failed"), false);
    assert.equal(cover.props.className.includes("is-loaded"), true);
    assert.equal(cover.props.children[1], null);
  }
});
