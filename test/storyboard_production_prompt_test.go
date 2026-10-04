package test

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

func TestStoryboardProductionPromptUsesStructuredShotData(t *testing.T) {
	document := storyboardProductionTestDocument()
	projection, err := energonservice.BuildStoryboardProductionPrompt(
		document,
		energonservice.StoryboardProductionPromptRequest{
			ItemType:      "shot_image",
			ItemID:        "shot-1",
			ShotImageMode: "first_last",
		},
	)
	if err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{
		"主体、环境和物件的相对尺度稳定",
		"视线目标和表情必须符合当前动作与情境",
		"空间层次、透视、遮挡、接触点、支撑关系和重力合理",
		"角色“甲”：短发，深色外套",
		"场景“乙”：有门窗和桌子的室内",
		"道具“丙”：放在桌面上的物件",
		"画幅：16:9",
	} {
		if !strings.Contains(projection.Prompt, expected) {
			t.Fatalf("production prompt is missing %q: %s", expected, projection.Prompt)
		}
	}
	if projection.StartFramePrompt == projection.EndFramePrompt {
		t.Fatal("first and last frame prompts must project different endpoint states")
	}
	if !strings.Contains(projection.StartFramePrompt, "起始状态") ||
		!strings.Contains(projection.EndFramePrompt, "结束状态") {
		t.Fatal("frame prompts must use the structured continuity endpoints")
	}
	if strings.Contains(projection.StartFramePrompt, "走到桌边") ||
		strings.Contains(projection.EndFramePrompt, "走到桌边") {
		t.Fatal("static frame prompts must not mix in the temporal action beat")
	}
	if !strings.Contains(projection.StartFramePrompt, "人物与桌子保持真实尺度") ||
		!strings.Contains(projection.EndFramePrompt, "中景，人物位于桌边") {
		t.Fatal("frame prompts must project spatial layout and the selected endpoint framing")
	}
}

func TestStoryboardVideoProductionPromptProjectsRuntimeParameters(t *testing.T) {
	projection, err := energonservice.BuildStoryboardProductionPrompt(
		storyboardProductionTestDocument(),
		energonservice.StoryboardProductionPromptRequest{
			ItemType:      "shot",
			ItemID:        "shot-1",
			ShotImageMode: "references",
		},
	)
	if err != nil {
		t.Fatal(err)
	}
	if projection.AspectRatio != "16:9" || projection.Duration != 5 {
		t.Fatalf("unexpected runtime parameters: %#v", projection)
	}
	if projection.ReferenceMode != "references" {
		t.Fatalf("unexpected reference mode: %q", projection.ReferenceMode)
	}
	for _, expected := range []string{"动作推进：走到桌边", "结束状态：甲站在桌边", "时长：5 秒"} {
		if !strings.Contains(projection.Prompt, expected) {
			t.Fatalf("video prompt is missing %q: %s", expected, projection.Prompt)
		}
	}
}

func TestStoryboardProductionPreservesStyleAndSelectedMaterialSettings(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["visual_mode"] = "stylized"
	document["style_prompt"] = "手绘水彩，低饱和暖色，柔和侧光"
	materials := document["materials"].([]any)
	materials[0].(map[string]any)["prompt"] = "成年旅人，身高1米75，深色外套"
	materials[1].(map[string]any)["prompt"] = "高3米的木屋，门窗与桌面保持固定位置"
	materials[2].(map[string]any)["prompt"] = "木盒长30厘米、厚2厘米，能被单手托起"
	document["materials"] = append(materials,
		map[string]any{"id": "offscreen", "type": "character", "name": "远处的巨兽", "prompt": "肩高四米，银色鳞片"},
	)
	document["summary"] = "剧情背景不应复制进每张图片"
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["description"] = "旅人与桌子处于相近景深，桌面低于腰部，木盒仅占桌面一小角"
	for _, request := range []energonservice.StoryboardProductionPromptRequest{
		{ItemType: "character", ItemID: "character-1"},
		{ItemType: "scene", ItemID: "scene-1"},
		{ItemType: "prop", ItemID: "prop-1"},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_frame"},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_last"},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "last_frame", FrameRole: "end"},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "references"},
		{ItemType: "shot", ItemID: "shot-1", ShotImageMode: "first_frame"},
		{ItemType: "shot", ItemID: "shot-1", ShotImageMode: "none"},
	} {
		t.Run(request.ItemType+"/"+request.ItemID+"/"+request.ShotImageMode, func(t *testing.T) {
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, request)
			if err != nil {
				t.Fatal(err)
			}
			prompts := []string{projection.Prompt}
			if request.ShotImageMode == "first_last" {
				prompts = []string{projection.StartFramePrompt, projection.EndFramePrompt}
			}
			isShot := request.ItemID == "shot-1"
			for _, prompt := range prompts {
				for _, expected := range []string{"画面类型：风格化影像", document["style_prompt"].(string)} {
					if strings.Count(prompt, expected) != 1 {
						t.Errorf("expected shared style once: %q in %s", expected, prompt)
					}
				}
				for _, value := range document["materials"].([]any) {
					material := value.(map[string]any)
					want := material["id"] == request.ItemID || (isShot && material["id"] != "offscreen")
					count := strings.Count(prompt, material["prompt"].(string))
					if (want && count != 1) || (!want && count != 0) {
						t.Errorf("material %s: want included=%v, got occurrences=%d", material["id"], want, count)
					}
				}
				if strings.Contains(prompt, document["summary"].(string)) {
					t.Fatal("production prompt must not copy unrelated story context")
				}
				if isShot && (!strings.Contains(prompt, shot["description"].(string)) ||
					!strings.Contains(prompt, "画面占比不代表对象间真实大小")) {
					t.Fatal("shot must preserve authored spatial relationships and distinguish reference crop from physical size")
				}
			}
		})
	}
}

func TestStoryboardProductionKeepsAuthoredFantasyScale(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["materials"].([]any)[0].(map[string]any)["prompt"] = "幻想生物，体型超过整个城堡，六足透明骨架"
	document["style_prompt"] = ""
	projection, err := energonservice.BuildStoryboardProductionPrompt(document,
		energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1"})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(projection.Prompt, "幻想生物，体型超过整个城堡，六足透明骨架") {
		t.Fatal("authored nonhuman anatomy and scale must not be replaced by ordinary human dimensions")
	}
	if !strings.Contains(projection.Prompt, "画面类型：写实影像") || strings.Contains(projection.Prompt, "统一视觉风格：") {
		t.Fatal("missing historical style must preserve visual mode without an empty style clause")
	}
}

func TestStoryboardProductionEditablePromptReplacesGeneratedContent(t *testing.T) {
	document := storyboardProductionTestDocument()
	override := "近景，女孩弯腰观察桌边的木盒，保持真实人物与木盒比例"
	for _, request := range []energonservice.StoryboardProductionPromptRequest{
		{ItemType: "character", ItemID: "character-1", EditablePrompt: override},
		{ItemType: "scene", ItemID: "scene-1", EditablePrompt: override},
		{ItemType: "prop", ItemID: "prop-1", EditablePrompt: override},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_frame", EditablePrompt: override},
		{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_last", EditablePrompt: override},
		{ItemType: "shot", ItemID: "shot-1", ShotImageMode: "first_frame", EditablePrompt: override},
	} {
		t.Run(request.ItemType+"/"+request.ShotImageMode, func(t *testing.T) {
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, request)
			if err != nil {
				t.Fatal(err)
			}
			prompts := []string{projection.Prompt}
			if request.ShotImageMode == "first_last" {
				prompts = []string{projection.StartFramePrompt, projection.EndFramePrompt}
				if !strings.Contains(prompts[0], "单张首帧") || !strings.Contains(prompts[1], "单张尾帧") {
					t.Fatal("editable content must retain each image's endpoint role")
				}
			}
			for _, prompt := range prompts {
				if strings.Count(prompt, override) != 1 {
					t.Fatalf("editable prompt must appear exactly once per image: %s", prompt)
				}
				if strings.Contains(prompt, "甲从门边走向桌面") {
					t.Fatalf("generated shot content must be replaced after editing: %s", prompt)
				}
				expected := []string{"相对尺度稳定", "统一视觉风格：自然纪实风格"}
				if request.ItemID == "shot-1" {
					expected = append(expected, "角色“甲”：短发，深色外套", "明确参考：外观参考", "画幅：16:9", "视线目标和表情", "不融合或互换对象特征")
				}
				if request.ItemType == "shot" {
					expected = append(expected, "时长：5 秒", "输入图片作为首帧")
				}
				if request.ItemID == "shot-1" {
					expected = append(expected, "空间关系与真实尺度：人物与桌子保持真实尺度")
				}
				for _, text := range expected {
					if !strings.Contains(prompt, text) {
						t.Fatalf("production requirement %q must remain after editing: %s", text, prompt)
					}
				}
			}
		})
	}
}

func TestStoryboardProductionPreparationIsSharedByPreflightAndRun(t *testing.T) {
	runSource := readStoryboardProductionSource(t, "service/project/workspace_run.go")
	preflightSource := readStoryboardProductionSource(t, "service/project/workspace_storyboard_frame.go")
	if !strings.Contains(runSource, "prepareCanvasStoryboardProductionNode(") {
		t.Fatal("run path does not use the shared storyboard production preparation")
	}
	if !strings.Contains(preflightSource, "prepareCanvasStoryboardProductionNodeFromDocument(") {
		t.Fatal("preflight path does not reuse the prepared storyboard document")
	}
	preparationSource := readStoryboardProductionSource(t, "service/project/workspace_storyboard_production.go")
	for _, contract := range []string{
		`return prepareCanvasStoryboardProductionNodeFromDocument(node, document)`,
		`canvasStoryboardEditablePrompt(node, generatedPrompt)`,
		`EditablePrompt: editablePrompt`,
		`node.ComposerPrompt = projection.Prompt`,
		`params["prompt"] = projection.Prompt`,
		`projection.StartFramePrompt`,
		`projection.EndFramePrompt`,
	} {
		if !strings.Contains(preparationSource, contract) {
			t.Fatalf("manual storyboard prompt compatibility is missing %q", contract)
		}
	}

	frontSource := readStoryboardProductionSource(t, "front/src/nodes/body-work/space/space-storyboard-derived-specs.ts")
	if strings.Contains(frontSource, `resolution: "2k"`) {
		t.Fatal("storyboard derived nodes must not force a 2k model parameter")
	}
	if !strings.Contains(frontSource, `shotImageMode: imagePlan?.mode`) {
		t.Fatal("shot video nodes must preserve the normalized image reference mode")
	}
	referenceSource := readStoryboardProductionSource(t, "front/src/nodes/body-work/space/space-storyboard-reference.ts")
	if strings.Contains(referenceSource, "inferStoryboardReferencePurpose") ||
		strings.Contains(referenceSource, "storyboardReferenceContext") {
		t.Fatal("reference purposes must not be inferred from prompt keywords")
	}
	teamPowerSource := readStoryboardProductionSource(t, "service/team/frontend.go")
	if !strings.Contains(teamPowerSource, `energoninput.AppendMediaReferenceIndex(`) ||
		!strings.Contains(teamPowerSource, `req.MediaReferences,`) {
		t.Fatal("shared power execution must index the actual bound media references")
	}
}

func TestStoryboardShotImagePromptIndexesActualReferenceOrder(t *testing.T) {
	references := []energoninput.MediaReference{
		{Kind: "image", Label: "角色甲", Usage: "images"},
		{Kind: "image", Label: "室内场景", Usage: "images"},
		{Kind: "image", Label: "剧情道具", Usage: "images"},
	}
	prompt := energoninput.AppendMediaReferenceIndex("生成当前分镜参考图。", references)
	for _, expected := range []string{
		"图1（参考图1）= 第1张图片输入；素材标签：@角色甲（用途：参考图）",
		"图2（参考图2）= 第2张图片输入；素材标签：@室内场景（用途：参考图）",
		"图3（参考图3）= 第3张图片输入；素材标签：@剧情道具（用途：参考图）",
	} {
		if !strings.Contains(prompt, expected) {
			t.Fatalf("media reference index is missing %q: %s", expected, prompt)
		}
	}
	prompt = energoninput.AppendMediaReferenceIndex(prompt, references)
	if strings.Count(prompt, "参考素材索引（顺序与本次媒体输入一致）：") != 1 {
		t.Fatal("media reference index must be idempotent")
	}
}

func storyboardProductionTestDocument() map[string]any {
	return map[string]any{
		"visual_mode":  "photoreal",
		"style_prompt": "自然纪实风格",
		"aspect_ratio": "16:9",
		"references": []any{
			map[string]any{"key": "ref-1", "label": "外观参考", "purpose": "character"},
		},
		"materials": []any{
			map[string]any{"id": "character-1", "type": "character", "name": "甲", "prompt": "短发，深色外套", "reference_keys": []any{"ref-1"}},
			map[string]any{"id": "scene-1", "type": "scene", "name": "乙", "prompt": "有门窗和桌子的室内", "reference_keys": []any{}},
			map[string]any{"id": "prop-1", "type": "prop", "name": "丙", "prompt": "放在桌面上的物件", "reference_keys": []any{}},
		},
		"shots": []any{
			map[string]any{
				"id":                 "shot-1",
				"order":              1,
				"duration":           5,
				"description":        "甲从门边走向桌面",
				"beat":               "走到桌边",
				"camera_instruction": "中景固定机位",
				"start_framing":      "中景，人物位于门边",
				"end_framing":        "中景，人物位于桌边",
				"spatial_layout":     "人物与桌子保持真实尺度，木盒只占桌面一小部分",
				"video_prompt":       "动作自然",
				"material_ids":       []any{"character-1", "scene-1", "prop-1"},
				"reference_keys":     []any{"ref-1"},
				"shot_image_mode":    "first_last",
				"continuity_state": map[string]any{
					"entry": "甲站在门边",
					"exit":  "甲站在桌边",
				},
			},
		},
	}
}

func readStoryboardProductionSource(t *testing.T, relativePath string) string {
	t.Helper()
	data, err := os.ReadFile(filepath.Join("..", filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
