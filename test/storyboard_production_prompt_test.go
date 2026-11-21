package test

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
)

func TestStoryboardProductionFullPromptReachesModelRequest(t *testing.T) {
	for _, scenario := range []struct{ item, role, edited string }{
		{"shot_image", "start", ""}, {"shot_image", "end", ""}, {"shot", "", ""},
		{"shot_image", "start", "用户修改后的完整图片要求：从日光切到夜晚的蓝色灯光"}, {"shot", "", "用户修改后的完整镜头要求：按下开关，室内灯光由暗到亮"},
	} {
		t.Run(scenario.item+"/"+scenario.role+"/"+scenario.edited, func(t *testing.T) {
			document := storyboardProductionTestDocument()
			document["style_prompt"] = strings.Repeat("保留全部视觉细节。", 600) + "风格末尾标记"
			identity := "非人类向导，银蓝色皮肤，额头有两根短触角，穿米白色旅行服"
			document["materials"].([]any)[0].(map[string]any)["prompt"] = identity
			shot := document["shots"].([]any)[0].(map[string]any)
			shot["beat"] = "硬切至同场另一侧中景，剪辑说明不属于镜内动作"
			shot["transition"] = "从上一镜切入新机位"
			shot["video_prompt"] = strings.Repeat("保留本镜全部视听细节。", 600) + "室内低声雨声贯穿本镜，脚步声与落脚同步；轻声说话，句末留出停顿。"
			shot["speech"] = []any{map[string]any{"kind": "dialogue", "character_id": "character-1", "start_time": 0.5, "text": "这次把声音也带上。"}}
			shot["continuity_state"] = map[string]any{"entry": "人物站在窗前，阴天柔光，曝光稳定", "exit": "人物按下开关，台灯亮起，桌面变为暖光"}
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{
				ItemType: scenario.item, ItemID: "shot-1", FrameRole: scenario.role, EditablePrompt: scenario.edited,
				NativeAudio: scenario.item == "shot",
			})
			if err != nil {
				t.Fatal(err)
			}
			wantStyle := scenario.item == "shot_image"
			if strings.Contains(projection.Prompt, document["style_prompt"].(string)) != wantStyle || (scenario.edited != "" && !strings.Contains(projection.Prompt, scenario.edited)) {
				t.Fatal("prompt projection dropped authored text")
			}
			kind := "image"
			if scenario.item == "shot" {
				kind = "video"
			}
			references := generationPromptReferences()[:1]
			request := &botprotocol.ShemicRequest{
				Protocol:             botmodel.ProtocolComfyUI,
				Input:                map[string]any{"instructions": projection.Prompt, "images": []string{references[0].URL}},
				MediaReferencePrompt: generationPromptContext(references),
			}
			repo := generationPromptRepository{serviceParams: []botmodel.ServiceParam{
				{ID: 1, ParamID: 1, Key: "500.prompt", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
				{ID: 2, ParamID: 2, Key: "501.file", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[1]", Status: 1},
			}}
			mapped, err := energoninput.BuildMapped(context.Background(), repo, request, energoninput.Target{
				PowerID: 1, ServiceID: 1, Kind: kind, MediaParams: []energoninput.PowerParam{{ParamID: 2, AcceptedKinds: []string{"image"}}},
			})
			if err != nil {
				t.Fatal(err)
			}
			native, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(botprotocol.NativeInput{
				Request: request, Mapped: mapped,
				Provider: botmodel.Provider{Host: "https://example.invalid", Protocol: botmodel.ProtocolComfyUI},
				Account:  botmodel.Account{Key: "{\"username\":\"test-user\",\"password\":\"test-password\"}"},
				Power:    botmodel.Power{Kind: kind}, Service: botmodel.Service{Type: kind},
				ServiceEndpoint: botmodel.ServiceEndpoint{InterfaceType: botmodel.ServiceEndpointTypeWorkflowJSON,
					WorkflowJSON: "{\"500\":{\"class_type\":\"Prompt\",\"inputs\":{\"prompt\":\"\"}},\"501\":{\"class_type\":\"LoadURL\",\"inputs\":{\"file\":\"\"}}}"},
			})
			if err != nil {
				t.Fatal(err)
			}
			inputs, name, err := botprotocol.ComfyWorkflowInput(botprotocol.NormalizeMap(native.Body["prompt"]), "500.prompt")
			if err != nil {
				t.Fatal(err)
			}
			if !strings.HasPrefix(botprotocol.AsText(inputs[name]), projection.Prompt) {
				t.Fatal("model request replaced or truncated the full production prompt")
			}
			if strings.Contains(botprotocol.AsText(inputs[name]), shot["beat"].(string)) || strings.Contains(botprotocol.AsText(inputs[name]), shot["transition"].(string)) {
				t.Fatal("editing instructions leaked into the model request")
			}
			if strings.Count(botprotocol.AsText(inputs[name]), identity) != 1 {
				t.Fatal("model request must retain this shot's character identity even when a start frame is bound")
			}
			for _, required := range []string{"光照默认继承场景设定与起始画面", "同场换机位只改变观察角度，不重新布光", "只有分镜或本镜补充要求明确安排时间、天气或光源变化时"} {
				if !strings.Contains(botprotocol.AsText(inputs[name]), required) {
					t.Fatal("model request lost the default lighting rule", required)
				}
			}
			state := shot["continuity_state"].(map[string]any)
			if scenario.item == "shot" || scenario.role == "end" {
				if !strings.Contains(botprotocol.AsText(inputs[name]), state["exit"].(string)) {
					t.Fatal("default lighting overrode an authored light change")
				}
			}
			if scenario.item == "shot" {
				if !strings.Contains(botprotocol.AsText(inputs[name]), "这次把声音也带上。") {
					t.Fatal("model request dropped the authored dialogue")
				}
				if scenario.edited == "" && !strings.Contains(botprotocol.AsText(inputs[name]), shot["video_prompt"].(string)) {
					t.Fatal("model request dropped the authored sound direction")
				}
			}
		})
	}
}

func TestStoryboardCloseUpDoesNotRequireFullBody(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["start_framing"], shot["end_framing"] = "手部特写，只见手与纸张", "手部特写，只见手与纸张"
	for _, request := range []energonservice.StoryboardProductionPromptRequest{
		{ItemType: "shot", ItemID: "shot-1"},
		{ItemType: "shot_image", ItemID: "shot-1", FrameRole: "start"},
	} {
		projection, err := energonservice.BuildStoryboardProductionPrompt(document, request)
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(projection.Prompt, "手部特写，只见手与纸张") || strings.Contains(projection.Prompt, "人物始终完整入画") {
			t.Fatal("close-up received conflicting framing requirements", projection.Prompt)
		}
	}
}

func TestStoryboardProductionInheritsShotImageMode(t *testing.T) {
	for _, tc := range []struct{ mode, rule, reference string }{
		{"first_frame", "输入图片作为首帧", "frames"},
		{"first_last", "firstFrame 是本镜开场，lastFrame 是本镜结束画面", "frames"},
		{"last_frame", "输入图片作为尾帧", "frames"},
		{"next_first", "lastFrame 为相邻下一镜", "frames"},
		{"references", "并列视觉参考，不代表时间顺序", "references"},
		{"none", "不假定存在镜头图片", ""},
	} {
		t.Run(tc.mode, func(t *testing.T) {
			document := storyboardProductionTestDocument()
			document["shots"].([]any)[0].(map[string]any)["shot_image_mode"] = tc.mode
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1"})
			if err != nil {
				t.Fatal(err)
			}
			if !strings.Contains(projection.Prompt, tc.rule) || projection.ReferenceMode != tc.reference {
				t.Fatalf("stored mode %s was not inherited: %+v", tc.mode, projection)
			}
		})
	}
	document := storyboardProductionTestDocument()
	image, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1"})
	if err != nil || !strings.Contains(image.Prompt, "按顺序生成两张独立关键帧") {
		t.Fatalf("image projection lost stored first_last mode: %+v %v", image, err)
	}
	overridden, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1", ShotImageMode: "none"})
	if err != nil || !strings.Contains(overridden.Prompt, "不假定存在镜头图片") || overridden.ReferenceMode != "" {
		t.Fatalf("explicit mode did not override storyboard: %+v %v", overridden, err)
	}
}

func TestStoryboardProductionSingleFrameUsesSelectedEndpoint(t *testing.T) {
	for _, tc := range []struct{ mode, role, endpoint string }{
		{"first_frame", "", "start"},
		{"last_frame", "", "end"},
		{"last_frame", "start", "start"},
		{"first_last", "end", "end"},
	} {
		t.Run(tc.mode+"/"+tc.role, func(t *testing.T) {
			document := storyboardProductionTestDocument()
			document["shots"].([]any)[0].(map[string]any)["shot_image_mode"] = tc.mode
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1", FrameRole: tc.role})
			if err != nil {
				t.Fatal(err)
			}
			expected := projection.StartFramePrompt
			if tc.endpoint == "end" {
				expected = projection.EndFramePrompt
			}
			if projection.Prompt != expected {
				t.Fatalf("%s frame used the wrong storyboard state: %s", tc.endpoint, projection.Prompt)
			}
		})
	}
}

func TestStoryboardProductionGenericImagesPreserveEndpointOrder(t *testing.T) {
	for _, tc := range []struct {
		mode, expected string
		continues      bool
	}{
		{"first_frame", "第一张图片参考本镜起始画面", false},
		{"first_last", "第一张参考本镜起始状态，第二张参考本镜结束状态", false},
		{"next_first", "第一张参考本镜起始状态，第二张参考本镜结束状态", false},
		{"last_frame", "输入图片参考本镜结束状态", false},
	} {
		t.Run(tc.mode, func(t *testing.T) {
			document := storyboardProductionTestDocument()
			shot := document["shots"].([]any)[0].(map[string]any)
			shot["shot_image_mode"] = tc.mode
			shot["continue_previous"] = tc.continues
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{
				ItemType: "shot", ItemID: "shot-1", ShotImageMode: "references",
			})
			if err != nil {
				t.Fatal(err)
			}
			if projection.ReferenceMode != "references" || !strings.Contains(projection.Prompt, tc.expected) {
				t.Fatalf("generic image transport lost temporal roles: %+v", projection)
			}
			if strings.Contains(projection.Prompt, "并列视觉参考，不代表时间顺序") {
				t.Fatal("endpoint references became unordered appearance references")
			}
			if shot["shot_image_mode"] != tc.mode {
				t.Fatal("source adaptation modified the authored storyboard")
			}
		})
	}
}

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
	for _, expected := range []string{"镜内动作与声音：走到桌边，动作自然", "结束状态：甲站在桌边", "时长：5 秒"} {
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
	shot["spatial_layout"] = "桌面低于旅人腰部，木盒宽度小于肩宽且仅占桌面一角；桌边与门框在同一地面透视中"
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
					count := strings.Count(prompt, expected)
					wantStyle := request.ItemType != "shot" || request.ShotImageMode == "none"
					if (wantStyle && count != 1) || (!wantStyle && count != 0) {
						t.Errorf("style must be supplied by images when a start frame exists: %q in %s", expected, prompt)
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
				if isShot && ((request.ItemType == "shot" && !strings.Contains(prompt, shot["description"].(string))) ||
					strings.Count(prompt, shot["spatial_layout"].(string)) != 1 ||
					!strings.Contains(prompt, "画面占比不代表对象间真实大小")) {
					t.Fatal("shot must preserve authored spatial relationships and distinguish reference crop from physical size")
				}
			}
		})
	}
}

func TestStoryboardStaticFramesDoNotDescribeTheWholeAction(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["description"] = "甲拿起桌上的木盒"
	shot["continuity_state"] = map[string]any{"entry": "木盒放在桌面，甲双手尚未接触木盒", "exit": "甲双手捧着离开桌面的木盒"}
	projection, err := energonservice.BuildStoryboardProductionPrompt(document,
		energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_last"})
	if err != nil {
		t.Fatal(err)
	}
	for _, tc := range []struct{ prompt, state, opposite string }{
		{projection.StartFramePrompt, "木盒放在桌面，甲双手尚未接触木盒", "甲双手捧着离开桌面的木盒"},
		{projection.EndFramePrompt, "甲双手捧着离开桌面的木盒", "木盒放在桌面，甲双手尚未接触木盒"},
	} {
		if !strings.Contains(tc.prompt, tc.state) || strings.Contains(tc.prompt, tc.opposite) || strings.Contains(tc.prompt, shot["description"].(string)) {
			t.Fatalf("static endpoint was polluted by another time state: %s", tc.prompt)
		}
	}
	video, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1"})
	if err != nil || !strings.Contains(video.Prompt, shot["description"].(string)) {
		t.Fatal("video lost the authored action")
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

func TestStoryboardProductionPreservesScaleAcrossEditedEndpoints(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["spatial_layout"] = "甲与木盒处于相近景深；盒宽为甲肩宽的一半，桌面低于甲腰部，门框高于甲头顶"
	shot["continuity_state"] = map[string]any{
		"entry": "木盒底面平放在桌面，甲右手指尖接触盒盖",
		"exit":  "甲右掌托住木盒底面，盒底离开桌面",
	}
	for _, editable := range []string{"", "近景，只显示甲的手和木盒，背景仍为原房间"} {
		projection, err := energonservice.BuildStoryboardProductionPrompt(document,
			energonservice.StoryboardProductionPromptRequest{
				ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: "first_last", EditablePrompt: editable,
			})
		if err != nil {
			t.Fatal(err)
		}
		for frameRole, prompt := range map[string]string{"entry": projection.StartFramePrompt, "exit": projection.EndFramePrompt} {
			if strings.Count(prompt, shot["spatial_layout"].(string)) != 1 {
				t.Fatalf("%s must retain the authored body, prop and environment scale once: %s", frameRole, prompt)
			}
			for endpoint, state := range shot["continuity_state"].(map[string]any) {
				wantState := endpoint == frameRole
				if strings.Contains(prompt, state.(string)) != wantState {
					t.Fatalf("%s contact state leaked or was lost with editable=%q: %s", endpoint, editable, prompt)
				}
			}
			if editable != "" && strings.Count(prompt, editable) != 1 {
				t.Fatalf("edited picture note must appear once: %s", prompt)
			}
		}
	}
}

func TestStoryboardProductionReferenceConstraintsPreserveSourceScope(t *testing.T) {
	document := storyboardProductionTestDocument()
	materials := document["materials"].([]any)
	materials[0].(map[string]any)["prompt"] = "旅人身高1米75，短发，深色外套"
	materials[2].(map[string]any)["prompt"] = "幻想木盒宽三米，木质盒盖与金属铰链"
	document["materials"] = append(materials, map[string]any{
		"id": "off-scope", "type": "character", "name": "画外巨人", "prompt": "身高十米",
	})
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["spatial_layout"] = "旅人与木盒处于相近景深；幻想木盒宽三米，大于旅人身高，人物站在盒边且双脚接触地面"
	for _, mode := range []string{"references", "first_frame", "first_last", "last_frame", "none"} {
		t.Run(mode, func(t *testing.T) {
			projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{
				ItemType: "shot_image", ItemID: "shot-1", ShotImageMode: mode,
				EditablePrompt: "盒盖细节近景",
			})
			if err != nil {
				t.Fatal(err)
			}
			if mode != "references" {
				if len(projection.ImageSequenceFixedConstraints) != 0 {
					t.Fatal("non-reference images gained sequence constraints")
				}
				return
			}
			fixed := strings.Join(projection.ImageSequenceFixedConstraints, "\n")
			for _, expected := range []string{
				document["style_prompt"].(string),
				materials[0].(map[string]any)["prompt"].(string),
				materials[1].(map[string]any)["prompt"].(string),
				materials[2].(map[string]any)["prompt"].(string),
				shot["spatial_layout"].(string),
			} {
				if !strings.Contains(fixed, expected) {
					t.Fatalf("fixed constraints lost source setting %q: %s", expected, fixed)
				}
			}
			for _, forbidden := range []string{"画外巨人", "身高十米", "甲站在门边", "甲站在桌边", "走到桌边", "盒盖细节近景"} {
				if strings.Contains(fixed, forbidden) {
					t.Fatalf("fixed constraints included variable or off-scope content %q: %s", forbidden, fixed)
				}
			}
		})
	}
}

func TestStoryboardProductionEditablePromptPreservesShotContract(t *testing.T) {
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
				expected := []string{"相对尺度稳定"}
				if request.ItemType != "shot" {
					expected = append(expected, "统一视觉风格：自然纪实风格")
				}
				if request.ItemID == "shot-1" {
					if request.ItemType != "shot" {
						expected = append(expected, "角色“甲”：短发，深色外套")
					}
					expected = append(expected, "明确参考：外观参考", "画幅：16:9", "视线目标和表情", "不融合或互换对象特征")
				}
				if request.ItemType == "shot" {
					expected = append(expected, "时长：5 秒", "输入图片作为首帧", "起始状态：甲站在门边", "结束状态：甲站在桌边", "运镜：中景固定机位")
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
	if !strings.Contains(preflightSource, "prepareCanvasStoryboardSourceParams(") {
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
	if !strings.Contains(frontSource, `shotImageMode: "first_last"`) {
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
				"video_prompt":       "走到桌边，动作自然",
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

func TestStoryboardProductionMVSeparatesSoundtrackFromStoryActions(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["work_type"] = "mv"
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["beat"] = "她把信纸交给窗边的朋友"
	for _, nativeAudio := range []bool{false, true} {
		projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{
			ItemType: "shot", ItemID: "shot-1", NativeAudio: nativeAudio, EditablePrompt: "暖色故事画面，她把信纸交给窗边的朋友",
		})
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(projection.Prompt, "画面角色不因歌曲含有人声而张嘴或对口型") || !strings.Contains(projection.Prompt, shot["beat"].(string)) {
			t.Fatal("MV lost story action or treated soundtrack as on-screen performance", projection.Prompt)
		}
	}
}

func TestStoryboardFirstFrameKeepsOffscreenCharactersOut(t *testing.T) {
	for _, mode := range []string{"first_frame", "first_last", "next_first", "references", "none"} {
		document := storyboardProductionTestDocument()
		shot := document["shots"].([]any)[0].(map[string]any)
		shot["shot_image_mode"] = mode
		shot["description"] = "甲在画面内，乙站在画外"
		projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1", ShotImageMode: mode})
		if err != nil {
			t.Fatal(err)
		}
		want := mode == "first_frame" || mode == "first_last" || mode == "next_first"
		if strings.Contains(projection.Prompt, "画外声音不引入新的画面主体") != want {
			t.Fatalf("first-frame visibility rule does not match input mode %s: %s", mode, projection.Prompt)
		}
	}
}

func TestStoryboardProductionEmptyShotUsesOnlyItsVisualInputs(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["style_prompt"] = "自然遗产环境与友好风格化三维动画角色合成"
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["material_ids"] = []any{"scene-1"}
	shot["reference_keys"] = []any{}
	shot["description"] = "无人崖壁全景"
	shot["beat"] = "保持空旷的崖壁画面"
	shot["camera_instruction"] = "轻微向右侧移"
	shot["start_framing"], shot["end_framing"] = "崖壁全景", "崖壁全景"
	shot["continuity_state"] = map[string]any{"entry": "无人崖壁", "exit": "无人崖壁"}
	shot["spatial_layout"] = "山崖位于远景"
	shot["continuity_anchor"] = "山崖"
	shot["video_prompt"] = "完整保留本镜补充要求，画面无人物"
	shot["speech"] = []any{map[string]any{"kind": "dialogue", "character_id": "character-1", "speaker_mode": "offscreen", "start_time": 0, "text": "看山崖。"}}
	before, _ := json.Marshal(document)
	for _, kind := range []string{"shot_image", "shot"} {
		for _, mode := range []string{"first_frame", "references", "none"} {
			p, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: kind, ItemID: "shot-1", ShotImageMode: mode, NativeAudio: true})
			if err != nil {
				t.Fatal(err)
			}
			for _, unrelated := range []string{"短发，深色外套", "脸、手", "面部结构", "腰胯", "坐站", "换手", "座椅"} {
				if strings.Contains(p.Prompt, unrelated) {
					t.Fatalf("%s/%s: empty shot received unrelated character input %q: %s", kind, mode, unrelated, p.Prompt)
				}
			}
			if kind == "shot" {
				if !strings.HasPrefix(p.Prompt, "画面内容：无人崖壁全景。镜内动作与声音：完整保留本镜补充要求，画面无人物。运镜：轻微向右侧移") || !strings.Contains(p.Prompt, shot["video_prompt"].(string)) || !strings.Contains(p.Prompt, "画外对白") {
					t.Fatal("shot lost authored picture, motion, or offscreen audio", p.Prompt)
				}
			}
		}
	}
	after, _ := json.Marshal(document)
	if string(before) != string(after) {
		t.Fatal("production modified the confirmed storyboard")
	}
}

func TestStoryboardVideoStyleFollowsFrameRoles(t *testing.T) {
	for _, tc := range []struct {
		mode, transport     string
		continues, hasStart bool
	}{
		{"first_frame", "first_frame", false, true},
		{"first_last", "first_last", false, true},
		{"next_first", "next_first", false, true},
		{"last_frame", "last_frame", false, false},
		{"references", "references", false, false},
		{"none", "none", false, false},
		{"first_frame", "references", false, true},
		{"last_frame", "references", false, false},
		{"none", "references", true, true},
	} {
		document := storyboardProductionTestDocument()
		shot := document["shots"].([]any)[0].(map[string]any)
		shot["shot_image_mode"], shot["continue_previous"] = tc.mode, tc.continues
		p, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1", ShotImageMode: tc.transport})
		if err != nil {
			t.Fatal(err)
		}
		if strings.Contains(p.Prompt, document["style_prompt"].(string)) == tc.hasStart {
			t.Fatalf("%+v: incorrect frame style source: %s", tc, p.Prompt)
		}
		if strings.Count(p.Prompt, "短发，深色外套") != 1 {
			t.Fatalf("%+v: character identity must reach video requests with or without a start frame: %s", tc, p.Prompt)
		}
		if strings.Contains(p.Prompt, "视觉风格、主体外观、材质与光线承接首帧") != tc.hasStart {
			t.Fatalf("%+v: incorrect frame style source: %s", tc, p.Prompt)
		}
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

func TestStoryboardContinuationUsesSharedPlanningOpening(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["continue_previous"], shot["shot_image_mode"] = true, "first_last"
	shot["camera_instruction"] = "沿原方向匀速跟拍"
	shot["handoff"] = map[string]any{"incoming": "接住前一段行进的步伐", "camera_path": "穿过门口"}
	video, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1"})
	if err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{"firstFrame 与上一镜的 lastFrame 使用同一张规划图", "lastFrame 是本镜结束图", "运镜：沿原方向匀速跟拍", "穿过门口", "本镜入点：接住前一段行进的步伐", "结束状态：甲站在桌边"} {
		if !strings.Contains(video.Prompt, expected) {
			t.Fatalf("continued video lost %q: %s", expected, video.Prompt)
		}
	}
	image, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1", FrameRole: "end", ShotImageMode: "last_frame"})
	if err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{"静态构图：中景，人物位于桌边", "结束状态：甲站在桌边", "到达尾帧机位的运镜：沿原方向匀速跟拍"} {
		if !strings.Contains(image.Prompt, expected) {
			t.Fatalf("end image lost %q: %s", expected, image.Prompt)
		}
	}
	if strings.Contains(image.Prompt, shot["video_prompt"].(string)) || strings.Contains(image.Prompt, "接住前一段行进的步伐") || strings.Contains(image.Prompt, "穿过门口") {
		t.Fatalf("end image received video action or the cross-scene route instead of just its camera and endpoint: %s", image.Prompt)
	}
}

func TestStoryboardNativeVideoAudioPreservesAuthoredSpeech(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["narrator_voice"] = "低沉平缓的旁白"
	document["materials"].([]any)[0].(map[string]any)["voice"] = "轻柔清晰的女声"
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["speech"] = []any{
		map[string]any{"id": "a", "kind": "dialogue", "character_id": "character-1", "speaker_mode": "onscreen", "start_time": 0.5, "text": "请放在桌上。"},
		map[string]any{"id": "b", "kind": "dialogue", "character_id": "listener", "speaker_mode": "offscreen", "start_time": 2, "text": "好的。"},
		map[string]any{"id": "n", "kind": "narration", "start_time": 3, "text": "雨停了。"},
	}
	before, _ := json.Marshal(document)
	for _, native := range []bool{false, true} {
		p, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1", NativeAudio: native})
		if err != nil {
			t.Fatal(err)
		}
		if strings.Contains(p.Prompt, "不生成可辨识对白") == native {
			t.Fatal("contradictory audio instruction", p.Prompt)
		}
		for _, text := range []string{"请放在桌上。", "好的。", "雨停了。", "台词起点 0.5 秒", "出镜对白", "画外对白", "画外旁白", "低沉平缓的旁白", "轻柔清晰的女声"} {
			if strings.Contains(p.Prompt, text) != native {
				t.Fatalf("native=%v speech projection %q: %s", native, text, p.Prompt)
			}
		}
		if !strings.Contains(p.Prompt, shot["start_framing"].(string)) {
			t.Fatal("audio changed framing")
		}
	}
	after, _ := json.Marshal(document)
	if string(before) != string(after) {
		t.Fatal("projection rewrote authored storyboard")
	}
}

// Execution must obey explicit material IDs, not infer cast by matching prose.
func TestStoryboardProductionPreservesExplicitCast(t *testing.T) {
	document := storyboardProductionTestDocument()
	document["materials"] = append(document["materials"].([]any), map[string]any{"id": "listener", "type": "character", "name": "乙同事", "prompt": "浅色衬衫"})
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["material_ids"] = []any{"character-1", "scene-1", "prop-1"}
	shot["description"] = "甲望向画外乙同事"
	before, _ := json.Marshal(document)
	for _, kind := range []string{"shot_image", "shot"} {
		p, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: kind, ItemID: "shot-1", FrameRole: "start"})
		if err != nil {
			t.Fatal(err)
		}
		if strings.Contains(p.Prompt, "浅色衬衫") || !strings.Contains(p.Prompt, "短发，深色外套") {
			t.Fatal("cast changed from authored IDs", p.Prompt)
		}
	}
	after, _ := json.Marshal(document)
	if string(before) != string(after) {
		t.Fatal("production rewrote storyboard")
	}
}

func TestStoryboardNativeAudioWithoutSpeech(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["speech"] = []any{}
	projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot", ItemID: "shot-1", NativeAudio: true})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(projection.Prompt, "本镜没有台词或旁白") || strings.Contains(projection.Prompt, "以下是完整台词") {
		t.Fatal("silent shot must not request dialogue", projection.Prompt)
	}
	if !strings.HasPrefix(projection.Prompt, "画面内容：") || strings.Index(projection.Prompt, "镜内动作与声音：") > strings.Index(projection.Prompt, "本镜没有台词或旁白") {
		t.Fatal("authored shot content must precede generic sound rules")
	}
}

func TestStoryboardFrameUsesAuthoredCameraBeforeMaterialReferences(t *testing.T) {
	document := storyboardProductionTestDocument()
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["match_previous"] = true
	shot["start_framing"] = "同侧反打近景，仅主体上身入画"
	shot["camera_instruction"] = "固定机位，容纳主体从坐姿起身至站立，保持原景别"
	before, _ := json.Marshal(document)
	for _, role := range []string{"start", "end"} {
		projection, err := energonservice.BuildStoryboardProductionPrompt(document, energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1", FrameRole: role})
		if err != nil {
			t.Fatal(err)
		}
		if strings.Index(projection.Prompt, "静态构图：") > strings.Index(projection.Prompt, "本镜素材设定") {
			t.Fatal("material references override authored camera")
		}
		if strings.Contains(projection.Prompt, "按本镜首帧构图重新取景") != (role == "start") {
			t.Fatal("a new camera must apply at the opening, not be introduced again at its end")
		}
		if strings.Contains(projection.Prompt, shot["camera_instruction"].(string)) != (role == "end") {
			t.Fatal("only the end image should receive the path from the opening camera to its endpoint")
		}
		if !strings.Contains(projection.Prompt, shot[role+"_framing"].(string)) {
			t.Fatal("frame prompt lost its static framing")
		}
	}
	after, _ := json.Marshal(document)
	if string(before) != string(after) {
		t.Fatal("projection rewrote the saved shot")
	}
}

func TestStoryboardNewSceneFrameKeepsCharactersFromPreviousScene(t *testing.T) {
	document := storyboardProductionTestDocument()
	request := energonservice.StoryboardProductionPromptRequest{ItemType: "shot_image", ItemID: "shot-1", FrameRole: "start"}
	plain, err := energonservice.BuildStoryboardProductionPrompt(document, request)
	if err != nil {
		t.Fatal(err)
	}
	request.PreviousSceneFrame = true
	carried, err := energonservice.BuildStoryboardProductionPrompt(document, request)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(plain.Prompt, "本镜换场") || !strings.Contains(carried.Prompt, "本镜换场") || !strings.Contains(carried.Prompt, "同一人物必须是同一个人") ||
		!strings.Contains(carried.Prompt, "不带入本镜") || !strings.Contains(carried.Prompt, "正脸或侧脸清晰可见") {
		t.Fatal("a carried new-scene frame must keep identity only", carried.Prompt)
	}
	if !strings.HasPrefix(carried.Prompt, "本镜换场") {
		t.Fatal("the carry instruction must lead the prompt so long prompts keep it", carried.Prompt)
	}
	if !strings.Contains(carried.Prompt, "光照按本镜场景设定和场景参考建立") || !strings.Contains(carried.Prompt, "不继承人物参考画面的环境光") {
		t.Fatal("new-scene identity reference must not override current scene lighting")
	}
	shot := document["shots"].([]any)[0].(map[string]any)
	shot["match_previous"] = true
	cut, err := energonservice.BuildStoryboardProductionPrompt(document, request)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(cut.Prompt, "本镜换场") {
		t.Fatal("a same-scene cut edits the tail frame and must not be told to redraw the scene")
	}
}
