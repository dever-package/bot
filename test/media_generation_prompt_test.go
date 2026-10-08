package test

import (
	"context"
	"encoding/json"
	"reflect"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
)

func generationPromptReferences() []botinput.MediaReference {
	return []botinput.MediaReference{
		{ReferenceType: "asset", ReferenceID: 11, MediaIndex: 1, Kind: "image", URL: "https://files.example.invalid/First.PNG?sig=A%2fb#one", Label: "猫", Usage: "images"},
		{ReferenceType: "asset", ReferenceID: 12, MediaIndex: 1, Kind: "image", URL: "https://files.example.invalid/Second.PNG?sig=B%3d#two", Label: "猫咪", Usage: "images"},
	}
}

func generationPromptReferencePart(id uint64, label string) map[string]any {
	return map[string]any{"type": "reference", "ref_type": "asset", "ref_id": id, "label": label}
}

func generationPromptText(text string) map[string]any {
	return map[string]any{"type": "text", "text": text}
}

func generationPromptContext(references []botinput.MediaReference, parts ...any) *botprotocol.MediaReferencePromptContext {
	return &botprotocol.MediaReferencePromptContext{
		References: botinput.MediaReferencePromptMetadata(references),
		Content:    map[string]any{"version": 1, "parts": parts},
	}
}

func TestMediaGenerationPromptOnlyReferences(t *testing.T) {
	references := generationPromptReferences()[:1]
	context := generationPromptContext(references, generationPromptReferencePart(11, "猫"))
	for _, kind := range []string{"image", "video"} {
		for _, prompt := range []string{"@猫", "", botinput.AppendMediaReferenceIndex("", references)} {
			compiled := botinput.CompileMediaGenerationPrompt(prompt, kind, references, context)
			if !strings.Contains(compiled, "请根据以下参考素材生成") || !strings.Contains(compiled, "参考图1") || strings.Contains(compiled, "@猫") || strings.Contains(compiled, "素材标签：") {
				t.Fatalf("reference-only %s prompt was not compiled: %s", kind, compiled)
			}
			if strings.Count(compiled, "参考素材索引（") != 1 {
				t.Fatal("reference index must occur once")
			}
		}
	}
}

func TestMediaGenerationPromptPreservesActualText(t *testing.T) {
	references := generationPromptReferences()
	parts := []any{
		generationPromptReferencePart(11, "猫"), generationPromptText("追逐"), generationPromptReferencePart(12, "猫咪"),
		generationPromptText("，镜头缓慢推近。画面招牌写“@猫”。邮件 user@猫，保留 @未知。"),
	}
	context := generationPromptContext(references, parts...)
	prompt := "@猫追逐@猫咪，镜头缓慢推近。画面招牌写“@猫”。邮件 user@猫，保留 @未知。"
	compiled := botinput.CompileMediaGenerationPrompt(prompt, "video", []botinput.MediaReference{references[1], references[0]}, context)
	for _, expected := range []string{"参考图2追逐参考图1", "镜头缓慢推近", "画面招牌写“@猫”", "邮件 user@猫", "保留 @未知"} {
		if !strings.Contains(compiled, expected) {
			t.Fatalf("lost user text %q: %s", expected, compiled)
		}
	}
	if strings.Contains(compiled, "请根据以下") || strings.Contains(compiled, "素材标签：") {
		t.Fatalf("actual body was replaced or labels leaked: %s", compiled)
	}
	context = generationPromptContext(references[:1], generationPromptReferencePart(11, "猫"))
	prompt = "完整生产约束：主体位于画面左侧，固定机位。\n@猫\n向前走一步，画面文字“欢迎”。"
	compiled = botinput.CompileMediaGenerationPrompt(prompt, "video", references[:1], context)
	if !strings.Contains(compiled, "完整生产约束：主体位于画面左侧，固定机位。") || !strings.Contains(compiled, "向前走一步，画面文字“欢迎”。") || strings.Contains(compiled, "@猫") || strings.Contains(compiled, "请根据以下") {
		t.Fatalf("editor parts overwrote the generated body: %s", compiled)
	}
}

func TestMediaGenerationPromptFallbackAndIdentity(t *testing.T) {
	references := generationPromptReferences()
	context := &botprotocol.MediaReferencePromptContext{References: botinput.MediaReferencePromptMetadata(references)}
	compiled := botinput.CompileMediaGenerationPrompt("@猫咪 和 @猫；再看 @猫。user@猫，不改 @猫咪2，文字“@猫”。", "image", references, context)
	for _, expected := range []string{"参考图2 和 参考图1", "再看 参考图1", "user@猫", "@猫咪2", "文字“@猫”"} {
		if !strings.Contains(compiled, expected) {
			t.Fatalf("label boundary changed %q: %s", expected, compiled)
		}
	}
	compiled = botinput.CompileMediaGenerationPrompt("It's a close-up of @猫。Keep the cat's pose.", "image", references, context)
	if !strings.Contains(compiled, "It's a close-up of 参考图1。Keep the cat's pose.") {
		t.Fatalf("apostrophe blocked a known reference: %s", compiled)
	}
	references[1].Label = "猫"
	context = generationPromptContext(references, generationPromptReferencePart(12, "猫"), generationPromptText("和"), generationPromptReferencePart(11, "猫"))
	compiled = botinput.CompileMediaGenerationPrompt("@猫和@猫", "image", references, context)
	if !strings.Contains(compiled, "参考图2和参考图1") {
		t.Fatalf("same-label assets lost their identity: %s", compiled)
	}
	compiled = botinput.CompileMediaGenerationPrompt("@猫和@猫", "image", references[:1], context)
	if !strings.Contains(compiled, "@猫和参考图1") || strings.Contains(compiled, "参考图2") {
		t.Fatalf("unbound reference was assigned a nonexistent input: %s", compiled)
	}
}

func TestMediaGenerationPromptPreservesChat(t *testing.T) {
	references := generationPromptReferences()
	prompt := botinput.AppendMediaReferenceIndex("请解释 @猫", references)
	for _, kind := range []string{"", "chat", "audio"} {
		if got := botinput.CompileMediaGenerationPrompt(prompt, kind, references, generationPromptContext(references)); got != prompt {
			t.Fatalf("%s prompt behavior changed", kind)
		}
	}
	if !strings.Contains(prompt, "素材标签：@猫") {
		t.Fatal("chat reference catalog must retain labels")
	}
}

func TestMediaGenerationPromptStructuredQuotesAndSelection(t *testing.T) {
	references := generationPromptReferences()[:1]
	context := generationPromptContext(references, generationPromptText("参考「"), generationPromptReferencePart(11, "猫"), generationPromptText("」，招牌写「@猫」。"))
	compiled := botinput.CompileMediaGenerationPrompt("参考「@猫」，招牌写「@猫」。", "image", references, context)
	if !strings.Contains(compiled, "参考「参考图1」，招牌写「@猫」。") {
		t.Fatalf("structured reference and display text were confused: %s", compiled)
	}
	context = generationPromptContext(references, generationPromptReferencePart(11, "猫"))
	compiled = botinput.CompileMediaGenerationPrompt("联系 user@猫，招牌写「@猫」。使用 @猫 和 @猫，忽略 @猫咪2。", "image", references, context)
	if !strings.Contains(compiled, "联系 user@猫，招牌写「@猫」。使用 参考图1 和 参考图1，忽略 @猫咪2。") {
		t.Fatalf("derived body reference boundaries changed: %s", compiled)
	}
	selection := generationPromptReferencePart(11, "猫")
	selection["ref_media_index"] = 2
	references = append(references, botinput.MediaReference{ReferenceType: "asset", ReferenceID: 11, MediaIndex: 2, Kind: "image", URL: "https://example.invalid/second.png", Label: "猫"})
	context = generationPromptContext(references, selection)
	compiled = botinput.CompileMediaGenerationPrompt("@猫", "image", references, context)
	if !strings.Contains(compiled, "。\n参考图2\n") {
		t.Fatalf("selected source media index was lost: %s", compiled)
	}
}

type generationPromptRepository struct {
	serviceParams []botmodel.ServiceParam
}

func (generationPromptRepository) ParamMap(context.Context) map[uint64]botmodel.Param {
	return map[uint64]botmodel.Param{
		1: {ID: 1, Key: "instructions", Type: "prompt", ValueType: "string", Status: 1},
		2: {ID: 2, Key: "images", Type: "files", ValueType: "string", MaxFiles: 3, Status: 1},
	}
}
func (generationPromptRepository) PowerParamsByPower(context.Context, uint64) []botmodel.PowerParam {
	return []botmodel.PowerParam{{ID: 1, ParamID: 1, Show: 1, Status: 1}, {ID: 2, ParamID: 2, Show: 1, Status: 2}}
}
func (repo generationPromptRepository) ServiceParamsByService(context.Context, uint64) []botmodel.ServiceParam {
	return repo.serviceParams
}
func (generationPromptRepository) ServiceEndpointsByService(context.Context, uint64) []botmodel.ServiceEndpoint {
	return nil
}
func (generationPromptRepository) ParamOptionsByParam(context.Context, uint64) []botmodel.ParamOption {
	return nil
}

func TestMediaGenerationPromptComfyUIMappedFileOrder(t *testing.T) {
	references := generationPromptReferences()
	repo := generationPromptRepository{serviceParams: []botmodel.ServiceParam{
		{ID: 1, ParamID: 1, Key: "500.prompt", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
		{ID: 2, ParamID: 2, Key: "501.file", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[2]", FileValueFormat: "base64", Status: 1},
		{ID: 3, ParamID: 2, Key: "502.file", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[1]", FileValueFormat: "data_url", Status: 1},
	}}
	request := &botprotocol.ShemicRequest{
		Protocol:             botmodel.ProtocolComfyUI,
		Input:                map[string]any{"instructions": "@猫追逐@猫咪，镜头缓慢推近。", "images": []string{references[0].URL, references[1].URL}, "caption": "普通字段 @猫"},
		MediaReferencePrompt: generationPromptContext(references, generationPromptReferencePart(11, "猫"), generationPromptText("追逐"), generationPromptReferencePart(12, "猫咪"), generationPromptText("，镜头缓慢推近。")),
	}
	before, _ := json.Marshal(request)
	mapped, err := botinput.BuildMapped(context.Background(), repo, request, botinput.Target{PowerID: 1, ServiceID: 1, Kind: "video", MediaParams: []botinput.PowerParam{{ParamID: 2, AcceptedKinds: []string{"image"}}}})
	if err != nil {
		t.Fatal(err)
	}
	native, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(botprotocol.NativeInput{
		Request: request, Mapped: mapped,
		Provider: botmodel.Provider{Host: "https://example.invalid", Protocol: botmodel.ProtocolComfyUI},
		Account:  botmodel.Account{Key: `{"username":"user","password":"password"}`},
		Power:    botmodel.Power{Kind: "video"}, Service: botmodel.Service{Type: "video"},
		ServiceEndpoint: botmodel.ServiceEndpoint{InterfaceType: botmodel.ServiceEndpointTypeWorkflowJSON, WorkflowJSON: `{"500":{"class_type":"Prompt","inputs":{"prompt":""}},"501":{"class_type":"LoadURL","inputs":{"file":""}},"502":{"class_type":"LoadURL","inputs":{"file":""}}}`},
	})
	if err != nil {
		t.Fatal(err)
	}
	workflow := botprotocol.NormalizeMap(native.Body["prompt"])
	for index, key := range []string{"501.file", "502.file"} {
		inputs, name, err := botprotocol.ComfyWorkflowInput(workflow, key)
		if err != nil || inputs[name] != references[1-index].URL {
			t.Fatalf("actual file mapping or signed URL changed: %s, %v", key, inputs)
		}
	}
	inputs, name, _ := botprotocol.ComfyWorkflowInput(workflow, "500.prompt")
	prompt := botprotocol.AsText(inputs[name])
	if !strings.HasPrefix(prompt, "参考图2追逐参考图1，镜头缓慢推近。") || strings.Contains(prompt, "素材标签：") || strings.Contains(prompt, "@猫") {
		t.Fatalf("native prompt does not match actual reordered files: %s", prompt)
	}
	if mapped.Original["caption"] != "普通字段 @猫" || mapped.Original["instructions"] != prompt {
		t.Fatal("prompt alias or unrelated text field changed incorrectly")
	}
	after, _ := json.Marshal(request)
	if !reflect.DeepEqual(before, after) {
		t.Fatal("compilation mutated the source request")
	}
}

func TestMediaGenerationPromptNativeArrayOrder(t *testing.T) {
	references := generationPromptReferences()
	for _, scenario := range []struct {
		name, want string
		files      []botmodel.ServiceParam
	}{
		{"array_positions", "参考图1追逐参考图2", []botmodel.ServiceParam{
			{ID: 2, ParamID: 2, Key: "content[2].image_url.url", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[2]", Status: 1},
			{ID: 3, ParamID: 2, Key: "content[1].image_url.url", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[1]", Status: 1},
		}},
		{"range_positions", "参考图2追逐参考图1", []botmodel.ServiceParam{
			{ID: 2, ParamID: 2, Key: "content[1-2].image_url.url", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[2,1]", Status: 1},
		}},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			repo := generationPromptRepository{serviceParams: append([]botmodel.ServiceParam{{ID: 1, ParamID: 1, Key: "content[0].text", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1}}, scenario.files...)}
			request := &botprotocol.ShemicRequest{
				Protocol:             botmodel.ProtocolComfyUI,
				Input:                map[string]any{"instructions": "@猫追逐@猫咪", "images": []string{references[0].URL, references[1].URL}},
				MediaReferencePrompt: generationPromptContext(references, generationPromptReferencePart(11, "猫"), generationPromptText("追逐"), generationPromptReferencePart(12, "猫咪")),
			}
			mapped, err := botinput.BuildMapped(context.Background(), repo, request, botinput.Target{PowerID: 1, ServiceID: 1, Kind: "video", MediaParams: []botinput.PowerParam{{ParamID: 2, AcceptedKinds: []string{"image"}}}})
			if err != nil {
				t.Fatal(err)
			}
			content := botprotocol.NormalizeAnyList(mapped.NativeBody()["content"])
			if len(content) != 3 || !strings.HasPrefix(botprotocol.AsText(botprotocol.NormalizeMap(content[0])["text"]), scenario.want) {
				t.Fatalf("reference order does not match native array positions: %#v", content)
			}
			first := botprotocol.AsText(botprotocol.NormalizeMap(botprotocol.NormalizeMap(content[1])["image_url"])["url"])
			wantFirst := references[0].URL
			if scenario.name == "range_positions" {
				wantFirst = references[1].URL
			}
			if first != wantFirst {
				t.Fatalf("unexpected actual array input: %q", first)
			}
		})
	}
}

type generationPromptComboRepository struct{ generationPromptRepository }

func (repo generationPromptComboRepository) ParamMap(ctx context.Context) map[uint64]botmodel.Param {
	params := repo.generationPromptRepository.ParamMap(ctx)
	params[3] = botmodel.Param{ID: 3, Key: "style", Type: "option", ValueType: "string", Status: 1}
	params[4] = botmodel.Param{ID: 4, Key: "motion", Type: "option", ValueType: "string", Status: 1}
	return params
}
func (generationPromptComboRepository) ParamOptionsByParam(_ context.Context, id uint64) []botmodel.ParamOption {
	return []botmodel.ParamOption{{ID: id*10 + 1, ParamID: id, Value: "chosen"}}
}

func TestMediaGenerationPromptComboPreservesMappedBody(t *testing.T) {
	references := generationPromptReferences()[:1]
	repo := generationPromptComboRepository{generationPromptRepository{serviceParams: []botmodel.ServiceParam{
		{ID: 1, ParamID: 1, Key: "native_prompt", ParamRule: botmodel.ServiceParamRuleCombo, Mapping: `{"params":[3,4],"rows":[{"values":{"3":31,"4":41},"native_value":"组合生产正文：@猫，固定机位。"}]}`, Status: 1},
		{ID: 2, ParamID: 2, Key: "images", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
	}}}
	request := &botprotocol.ShemicRequest{Input: map[string]any{"prompt": "旧正文 @猫", "style": "chosen", "motion": "chosen", "images": []string{references[0].URL}}, MediaReferencePrompt: generationPromptContext(references, generationPromptReferencePart(11, "猫"))}
	mapped, err := botinput.BuildMapped(context.Background(), repo, request, botinput.Target{PowerID: 1, ServiceID: 1, Kind: "video", MediaParams: []botinput.PowerParam{{ParamID: 2, AcceptedKinds: []string{"image"}}}})
	if err != nil {
		t.Fatal(err)
	}
	prompt := botprotocol.AsText(mapped.NativeBody()["native_prompt"])
	if !strings.HasPrefix(prompt, "组合生产正文：参考图1，固定机位。") || strings.Contains(prompt, "旧正文") || strings.Contains(prompt, "@猫") {
		t.Fatalf("combo output was overwritten or not compiled: %s", prompt)
	}
	if mapped.Original["style"] != "chosen" || mapped.Original["motion"] != "chosen" || request.Input["prompt"] != "旧正文 @猫" {
		t.Fatal("combo selectors or source prompt were overwritten")
	}
}

func TestMediaGenerationPromptMissingCustomPromptWithBoundMedia(t *testing.T) {
	references := generationPromptReferences()[:1]
	repo := generationPromptRepository{serviceParams: []botmodel.ServiceParam{
		{ID: 1, ParamID: 1, Key: "native_prompt", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
		{ID: 2, ParamID: 2, Key: "native_images", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
	}}
	for _, kind := range []string{"image", "video", "chat"} {
		for _, scenario := range []struct {
			name   string
			prompt string
			bind   bool
		}{
			{"empty", "", true}, {"only_index", botinput.AppendMediaReferenceIndex("", references), true}, {"only_reference", "@猫", true}, {"actual_body", "@猫 向前走一步，保持固定机位。", true}, {"unbound", "", false},
		} {
			t.Run(kind+"/"+scenario.name, func(t *testing.T) {
				input := map[string]any{"prompt": scenario.prompt, "instructions": ""}
				if scenario.bind {
					input["images"] = []string{references[0].URL}
				}
				req := &botprotocol.ShemicRequest{Input: input, MediaReferencePrompt: generationPromptContext(references, generationPromptReferencePart(11, "猫"))}
				mapped, err := botinput.BuildMapped(context.Background(), repo, req, botinput.Target{PowerID: 1, ServiceID: 1, Kind: kind, MediaParams: []botinput.PowerParam{{ParamID: 2, Key: "images", Type: "files", AcceptedKinds: []string{"image"}}}})
				if kind == "chat" || !scenario.bind {
					if err == nil {
						t.Fatal("missing custom prompt must still fail without generation media")
					}
					return
				}
				if err != nil {
					t.Fatal(err)
				}
				prompt := botprotocol.AsText(mapped.NativeBody()["native_prompt"])
				if strings.Contains(prompt, "@猫") || strings.Contains(prompt, "素材标签：") || !strings.Contains(prompt, "参考图1") {
					t.Fatalf("custom prompt was not compiled: %s", prompt)
				}
				if scenario.name == "actual_body" {
					if !strings.HasPrefix(prompt, "参考图1 向前走一步，保持固定机位。") {
						t.Fatalf("lost canonical body: %s", prompt)
					}
				} else if !strings.Contains(prompt, "请根据以下参考素材生成") {
					t.Fatalf("missing generation instruction: %s", prompt)
				}
				if req.Input["instructions"] != "" || req.Input["prompt"] != scenario.prompt {
					t.Fatal("source input was mutated")
				}
			})
		}
	}
}
