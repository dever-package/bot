package story

import "fmt"

// ScreenplayPrompt adapts manuscript scenes, not camera shots.
func ScreenplayPrompt(inputJSON, instruction string, targetDuration int) string {
	duration := "按正文完整情节安排时长"
	if targetDuration > 0 {
		duration = fmt.Sprintf("约%d秒是软目标，优先完整情节", targetDuration)
	}
	return fmt.Sprintf(`将本章正文改编成可拍摄的场景剧本。按时空与事件划分场次，同一场戏完整规划，不按固定秒数切碎。不生成镜头。覆盖全部原文，从第1段到最后一段，依次分配且不能重叠或遗漏。%s，不强压整章，不添加后章或全书结局。人物地点沿用输入设定。每场description是完整可编辑剧本，按“场景：地点与时间\n动作：人物可见行动\n人物名：逐句对白”的顺序书写；保留全部关键事件和原对白，不改说话人，不补台词。心理转为可拍动作或必要旁白。description不写景别、机位或摄影指令，这些交给分镜脚本节点。
source_passages的每个编号是不可重复分配的原文单元；下一片段source_start必须等于上一片段source_end+1。同一编号内有转场时保留在同一片段，在description中注明内部转场，不重复引用该编号。片段优先按同一时空内的连续场次划分，摄影机可实际走通的相邻空间可以属于同一场次，在描述中保留行进路线。connection只能reset（地点不相通或跳时）、match（同场次另起取景）、continue（沿同一条摄影路线连续拍摄，可通过运镜改变角度与景别）。同一地点隔日仍为reset；没有previous_part的第一片段必须reset，存在previous_part时按真实时间关系选择。scene写固定layout、axis和lighting；entry_state和exit_state只记本段起止时刻已出现人物与道具的具体状态，不把后续剧情提前做完。同场次复用布局和轴线。
characters和props仅引用materials中对应类型的已有ID，禁止空ID或新造ID。没有已登记道具时props必须为[]；手机、水杯等未登记日常物件的持有和位置写入人物pose或position，不省略其连续性。
只返回JSON：{"parts":[{"title":"具体片段名","description":"本段剧情及关键对白","source_start":1,"source_end":2,"target_duration":30,"connection":"reset","scene":{"layout":"固定空间布局","axis":"摄影机所在轴线侧","lighting":"光线"},"entry_state":{"characters":[{"character_id":"已有ID","position":"位置","pose":"坐站姿态","facing":"身体朝向","look_at":"视线目标"}],"props":[{"prop_id":"已有ID","owner_id":"已有持有人ID或空","hand":"左手/右手/双手或空","position":"位置","contact":"接触与承托关系"}]},"exit_state":{"characters":[],"props":[]}}]}。起止状态分别完整列出实际存在的主体，空场景使用空数组，ID原样引用materials。source_start/source_end为source_passages的起止编号，包含两端。不要返回Markdown或解释。补充要求：%s
输入：%s`, duration, instruction, inputJSON)
}
