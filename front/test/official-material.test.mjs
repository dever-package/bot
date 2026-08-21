import assert from "node:assert/strict";
import test from "node:test";

import {
  assetLibraryKey,
  defaultOfficialAssetKind,
  normalizeOfficialMaterial,
  normalizeOfficialMaterialCatalog,
  officialCategoriesForKind,
} from "../src/nodes/body-work/asset/official-material.ts";
import {
  canvasReferenceContentFromTargets,
  canvasReferenceTargetsFromContent,
} from "../src/nodes/body-work/space/space-reference-content.ts";

const catalog = normalizeOfficialMaterialCatalog({
  enabled: true,
  pack: { id: 7, name: "品牌素材" },
  kinds: [
    { id: "prompt", name: "提示词" },
    { id: "image", name: "图片" },
    { id: "video", name: "视频" },
  ],
  categories: [
    { id: 1, name: "通用文案", kind: "prompt" },
    { id: 2, name: "商品图", kind: "image" },
    { id: 3, name: "短视频", kind: "video" },
  ],
});

test("官方参考默认选择提示词，并按当前类型显示分类", () => {
  assert.equal(defaultOfficialAssetKind(catalog, []), "text");
  assert.equal(defaultOfficialAssetKind(catalog, ["image", "video"]), "image");
  assert.deepEqual(
    officialCategoriesForKind(catalog, "image").map((item) => item.name),
    ["商品图"],
  );
});

test("官方提示词与媒体统一映射为只读资产记录", () => {
  const prompt = normalizeOfficialMaterial({
    id: 21,
    cate_id: 1,
    cate_name: "通用文案",
    kind: "prompt",
    name: "小红书标题",
    description: "生成标题",
    content: "请生成五个标题",
  });
  const image = normalizeOfficialMaterial({
    id: 22,
    cate_id: 2,
    cate_name: "商品图",
    kind: "image",
    name: "品牌主视觉",
    resource_url: "/media/brand.png",
  });

  assert.equal(prompt.libraryType, "material");
  assert.equal(prompt.sourceType, "official");
  assert.equal(prompt.kind, "text");
  assert.deepEqual(prompt.version?.content, { text: "请生成五个标题" });
  assert.equal(prompt.materialCateName, "通用文案");
  assert.equal(image.kind, "image");
  assert.deepEqual(image.version?.content, { images: ["/media/brand.png"] });
});

test("用户资产和官方素材使用不同选择键，ID 相同也不会冲突", () => {
  assert.equal(assetLibraryKey({ id: 9, libraryType: "asset" }), "asset:9");
  assert.equal(
    assetLibraryKey({ id: 9, libraryType: "material" }),
    "material:9",
  );
});

test("画布提示词同时保留同 ID 的用户资产和官方素材引用", () => {
  const content = canvasReferenceContentFromTargets("@用户图片 @官方图片", [
    { refType: "asset", refId: 9, versionId: 3, label: "用户图片" },
    { refType: "material", refId: 9, label: "官方图片" },
  ]);

  assert.deepEqual(
    canvasReferenceTargetsFromContent(content).map((target) => [
      target.refType,
      target.refId,
      target.versionId || 0,
    ]),
    [
      ["asset", 9, 3],
      ["material", 9, 0],
    ],
  );
});
