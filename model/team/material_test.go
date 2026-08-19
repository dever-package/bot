package team

import "testing"

func TestMaterialKindOptionIsNotOverriddenByCategoryRelation(t *testing.T) {
	if len(materialKindOptions) != 4 {
		t.Fatalf("material kind options = %#v, want four options", materialKindOptions)
	}
	for _, option := range materialKindOptions {
		if option["id"] == "file" {
			t.Fatal("file must not be a selectable material kind")
		}
	}

	for _, key := range materialCateRelation.OptionKeys {
		if key == "kind" {
			t.Fatal("category relation must not alias its options as kind")
		}
	}
}

func TestNormalizeMaterialKind(t *testing.T) {
	tests := []struct {
		name string
		kind string
		want string
	}{
		{name: "prompt", kind: MaterialKindPrompt, want: MaterialKindPrompt},
		{name: "image", kind: MaterialKindImage, want: MaterialKindImage},
		{name: "audio", kind: MaterialKindAudio, want: MaterialKindAudio},
		{name: "video", kind: MaterialKindVideo, want: MaterialKindVideo},
		{name: "legacy file remains readable", kind: "file", want: "file"},
		{name: "trim and lowercase", kind: "  IMAGE  ", want: MaterialKindImage},
		{name: "unknown defaults to prompt", kind: "unknown", want: MaterialKindPrompt},
		{name: "empty defaults to prompt", kind: "", want: MaterialKindPrompt},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NormalizeMaterialKind(tt.kind); got != tt.want {
				t.Fatalf("NormalizeMaterialKind(%q) = %q, want %q", tt.kind, got, tt.want)
			}
		})
	}
}

func TestMaterialKindLabel(t *testing.T) {
	tests := []struct {
		kind string
		want string
	}{
		{kind: MaterialKindPrompt, want: "提示词"},
		{kind: MaterialKindImage, want: "图片"},
		{kind: MaterialKindAudio, want: "音频"},
		{kind: MaterialKindVideo, want: "视频"},
		{kind: "file", want: "文件"},
		{kind: "unknown", want: "提示词"},
	}

	for _, tt := range tests {
		if got := MaterialKindLabel(tt.kind); got != tt.want {
			t.Fatalf("MaterialKindLabel(%q) = %q, want %q", tt.kind, got, tt.want)
		}
	}
}
