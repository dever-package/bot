package energon

import (
	"fmt"
	"slices"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

const storyboardActionContinuityPrompt = `
连续叙事先排完整一场戏的触发、反应、可见行动及结果，再定摄影路线和切点。beat 写这一拍因什么而发生、观众要看懂什么；用停顿、视线、呼吸和回应表现情绪，不只写情绪标签。不为镜头数或时长跳过因果，不强行让人物在同一秒同时做动作、转头和说话。换机位只改视角，不重置人物、道具或动作阶段；同一次拍摄拆段才共用规划接点图。确有时空省略才写 continuity_state.time_jump，说明省略了什么或到达何处，并关闭 match_previous 和 continue_previous。否则 time_jump 留空。
- 每镜用 continuity_state.facts 记录对剧情有用的物理状态，material_id 引用本镜的角色、道具或场景 ID。同一素材每镜最多一条：角色的所在位置、身体姿态和与物件的接触合写成一份状态，不得拆开。道具的开合、所在位置和形态也合写；若道具已有独立素材 ID，不在场景状态里再写同一事实。暂时出画不清空状态。
- before 是完整起拍状态，普通切镜必须原文承接该素材上一次的结果。未变化可整条省略并继承；首次建立状态且没有动作时 after 与 action 同时留空。有变化时 after 必须是完整结果，保留未变的部分，不只写变化项；action 写实际可见的动作。有多段动作就按发生顺序写；一次动作影响多项素材时复用同一句 action。真正跳时须重新建立当时状态，不用跳时省略观众必须看到的行动。
- 构图只写机位、景别、焦点与遮挡，不另设人物或物件状态。涉及位置、接触、持物或道具形态的动作只在 facts 安排一次。video_prompt 写这些动作的速度、收势、先后，以及不改变既定状态的可见表演和现场声，不另编一套物理动作；已经完成的动作只保留结果。素材只描述稳定外观，不预设镜头某一刻的开合、站位或动作。`

func storyboardTracksContinuity(workType string) bool {
	return workType == botmodel.StoryboardWorkTypeShort || workType == botmodel.StoryboardWorkTypeNarrative
}

func storyboardContinuitySchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"time_jump": map[string]any{"type": "string"},
			"facts": map[string]any{"type": "array", "items": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"material_id": map[string]any{"type": "string", "minLength": 1},
					"before":      map[string]any{"type": "string", "minLength": 1},
					"after":       map[string]any{"type": "string"},
					"action":      map[string]any{"type": "string"},
				},
				"required":             []string{"material_id", "before", "after", "action"},
				"additionalProperties": false,
			}},
		},
		"required":             []string{"time_jump", "facts"},
		"additionalProperties": false,
	}
}

func ResolveStoryboardContinuity(document map[string]any) error {
	shots, _ := storyboardValueItems(document["shots"])
	materialNames := map[string]string{}
	materials, _ := storyboardValueItems(document["materials"])
	for _, value := range materials {
		material, _ := value.(map[string]any)
		materialNames[requiredString(material, "id")] = requiredString(material, "name")
	}
	world := map[string]string{}
	chapterConnection := requiredString(mapField(document, "chapter_boundary"), "connection")
	for index, value := range shots {
		shot, _ := value.(map[string]any)
		state := mapField(shot, "continuity_state")
		if _, exists := state["facts"]; !exists {
			clear(world)
			continue
		}
		facts, ok := state["facts"].([]any)
		jump, validJump := state["time_jump"].(string)
		if !ok || !validJump {
			return fmt.Errorf("镜头 %d 的动作连续性计划格式无效", index+1)
		}
		jump = strings.TrimSpace(jump)
		sharesChapterBoundary := index == 0 && (chapterConnection == "continue" || chapterConnection == "match")
		if jump != "" && (shot["continue_previous"] == true || shot["match_previous"] == true || sharesChapterBoundary) {
			return fmt.Errorf("镜头 %d 已安排换场或跳时，不能沿用上一镜的画面", index+1)
		}
		if jump != "" {
			clear(world)
		}
		visible := map[string]bool{}
		for _, id := range storyboardStringItems(shot["material_ids"]) {
			visible[id] = true
		}
		changes := make(map[string]string, len(facts))
		for _, raw := range facts {
			fact, ok := raw.(map[string]any)
			if !ok {
				return fmt.Errorf("镜头 %d 的连续状态条目格式无效", index+1)
			}
			id := requiredString(fact, "material_id")
			before := requiredString(fact, "before")
			after, validAfter := fact["after"].(string)
			action, validAction := fact["action"].(string)
			if !visible[id] || materialNames[id] == "" || before == "" || !validAfter || !validAction || len(fact) != 4 {
				return fmt.Errorf("镜头 %d 的连续状态必须引用本镜素材，每个素材只有一份完整的起止状态和动作，不得拆成多个属性", index+1)
			}
			after, action = strings.TrimSpace(after), strings.TrimSpace(action)
			name := materialNames[id]
			if _, seen := changes[id]; seen {
				return fmt.Errorf("镜头 %d 重复安排了「%s」的连续状态，站位、姿态和接触应合写", index+1, name)
			}
			if (after == "") != (action == "") {
				return fmt.Errorf("镜头 %d 中「%s」的状态变化必须由本镜实际演出的动作造成", index+1, name)
			}
			if prior, tracked := world[id]; tracked && prior != before {
				return fmt.Errorf("镜头 %d→%d 接不上：「%s」承接的状态为「%s」，本镜却从「%s」开始", index, index+1, name, prior, before)
			}
			world[id] = before
			changes[id] = after
		}
		entry := storyboardContinuityText(world, visible, materialNames)
		for key, after := range changes {
			if after != "" {
				world[key] = after
			}
		}
		exit := storyboardContinuityText(world, visible, materialNames)
		if index == 0 && chapterConnection == "continue" {
			previous := mapField(mapField(document, "previous_storyboard"), "shot")
			if shared := requiredString(mapField(previous, "continuity_state"), "exit"); shared != "" {
				if exit == entry {
					exit = shared
				}
				entry = shared
			}
		}
		state["entry"], state["exit"] = entry, exit
	}
	return nil
}

func storyboardContinuityText(world map[string]string, visible map[string]bool, materialNames map[string]string) string {
	var parts []string
	for id, status := range world {
		if visible[id] {
			parts = append(parts, materialNames[id]+"："+status)
		}
	}
	slices.Sort(parts)
	return strings.Join(parts, "；")
}

func storyboardContinuityActions(state map[string]any) string {
	facts, tracked := state["facts"].([]any)
	if !tracked {
		return ""
	}
	seen := map[string]bool{}
	var actions []string
	for _, raw := range facts {
		fact, _ := raw.(map[string]any)
		action := requiredString(fact, "action")
		if action != "" && !seen[action] {
			actions = append(actions, action)
			seen[action] = true
		}
	}
	return storyboardProductionJoin(
		storyboardProductionClause("本镜实际发生的状态变化动作，按顺序演出一次", strings.Join(actions, "；")),
		"起止状态与上述动作优先于其他画面描述；未安排改变的已记录状态在镜头中一直保持，不得先变再变回。只拍取景范围内的内容，不因列有状态而把画外人物或物件拉入画面",
	)
}
