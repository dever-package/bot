package test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
	botprovider "github.com/dever-package/bot/service/energon/provider"
)

func TestComfyUIExistingOptionsMapSingerPresets(t *testing.T) {
	input := comfyAdapterInput("https://example.invalid")
	input.Power.Kind, input.Service.Type = "audio", "audio"
	input.ServiceEndpoint.WorkflowJSON = `{"7":{"class_type":"DeverMusicPerformers","inputs":{"singers":[]}}}`
	input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "7.singers", ParamType: "option", Value: `[{"voice_id":"auto","gender":"女声"}]`}}
	request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
	if err != nil {
		t.Fatal(err)
	}
	workflow := request.Body["prompt"].(map[string]any)
	singers, ok := workflow["7"].(map[string]any)["inputs"].(map[string]any)["singers"].([]any)
	if !ok || len(singers) != 1 || singers[0].(map[string]any)["voice_id"] != "auto" {
		t.Fatal("configured singer preset must reach ComfyUI as an array")
	}
	for _, invalid := range []string{`{"voice_id":"auto"}`, `broken`} {
		input.Mapped.Params[0].Value = invalid
		if _, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input); err == nil {
			t.Fatalf("invalid array preset accepted: %q", invalid)
		}
	}
}

func TestComfyUIAudioLyricsAndAttachments(t *testing.T) {
	const lyric = "[主歌]\n清晨的风吹过山岗"
	const lrc = "[00:01.00]清晨的风吹过山岗\n"
	for _, testCase := range []struct {
		name       string
		attachment bool
		lyrics     bool
		status     int
		mime       string
		content    string
		wantError  string
	}{
		{name: "lyrics and LRC", attachment: true, lyrics: true, mime: "text/plain; charset=utf-8", content: lrc},
		{name: "LRC disabled", lyrics: true},
		{name: "instrumental"},
		{name: "missing LRC", attachment: true, lyrics: true, status: http.StatusNotFound, mime: "text/plain", content: "missing", wantError: "HTTP 404"},
		{name: "invalid encoding", attachment: true, lyrics: true, mime: "text/plain", content: string([]byte{0xff, 0xfe}), wantError: "UTF-8"},
		{name: "HTML response", attachment: true, lyrics: true, mime: "text/html", content: "<html>login</html>", wantError: "附件类型无效"},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if username, password, ok := r.BasicAuth(); !ok || username != "user" || password != " pw:two " {
					t.Error("audio and LRC downloads must retain source authentication")
				}
				if r.URL.Path != "/view" || r.URL.Query().Get("subfolder") != "dispatch/audio" || r.URL.Query().Get("type") != "output" {
					t.Errorf("file routing changed: %s", r.URL)
				}
				if r.URL.Query().Get("filename") == "song.mp3" {
					w.Header().Set("Content-Type", "audio/mpeg")
					w.Write([]byte("ID3audio"))
					return
				}
				w.Header().Set("Content-Type", testCase.mime)
				if testCase.status != 0 {
					w.WriteHeader(testCase.status)
				}
				w.Write([]byte(testCase.content))
			}))
			defer server.Close()
			input := comfyAdapterInput(server.URL)
			input.Power.Kind, input.Service.Type = "audio", "audio"
			input.ServiceEndpoint.WorkflowJSON = `{"12":{"class_type":"DeverMusicLyrics","inputs":{}},"98":{"class_type":"DeverSaveMusic","inputs":{"lyrics":["12",0]}}}`
			file := func(name string) map[string]any {
				return map[string]any{"filename": name, "subfolder": "dispatch/audio", "type": "output"}
			}
			prepared := map[string]any{"text": []any{"纯音乐 · 不生成歌词"}}
			if testCase.lyrics {
				prepared = map[string]any{"text": []any{lyric}, "structure": []any{"主歌"}}
			}
			saved := map[string]any{"audio": []any{file("song.mp3")}, "text": []any{"模型自然结束"}}
			if testCase.attachment {
				saved["lyrics"] = []any{file("song.lrc")}
			}
			history := map[string]any{"task-audio": map[string]any{"outputs": map[string]any{"12": prepared, "98": saved}}}
			encoded, err := json.Marshal(history)
			if err != nil {
				t.Fatal(err)
			}
			var body map[string]any
			if err = json.Unmarshal(encoded, &body); err != nil {
				t.Fatal(err)
			}
			value, err := (botadapters.ComfyUIAdapter{}).ResolveTaskResult(context.Background(), input, "task-audio", &botprovider.Response{StatusCode: 200, Body: body}, botprovider.NewHTTPClient(time.Second))
			if testCase.wantError != "" {
				if err == nil || !strings.Contains(err.Error(), testCase.wantError) {
					t.Fatalf("want %q, got %v", testCase.wantError, err)
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			result, ok := botprovider.AsBinaryMediaOutput(value)
			if !ok || len(result.Files) != 1 || string(result.Files[0].Content) != "ID3audio" || result.Text != "模型自然结束" {
				t.Fatalf("audio or status lost: %#v", result)
			}
			if testCase.lyrics && result.Lyrics != lyric || !testCase.lyrics && result.Lyrics != "" {
				t.Fatalf("prepared lyrics and instrumental status were confused: %q", result.Lyrics)
			}
			if testCase.attachment {
				if len(result.Attachments) != 1 || result.Attachments[0].Name != "song.lrc" || string(result.Attachments[0].Payload.Content) != lrc {
					t.Fatalf("LRC companion lost: %#v", result.Attachments)
				}
			} else if len(result.Attachments) != 0 {
				t.Fatal("generated an attachment that the workflow did not return")
			}
		})
	}
}
