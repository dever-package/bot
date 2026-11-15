package team

// 单条证据原文在容量紧张时保留的长度；事实文字本身不裁剪。
const writingEvidenceQuoteLimit = 240

// 写作历史随章节增长，容量不足时按影响从小到大依次精简：先缩短证据原文，
// 再从最早的一章起放弃召回的旧章细节，最后放弃已解决的线索。人物当前状态和
// 未解线索始终完整保留。fits 接收候选历史及精简说明，返回请求是否已能放入来源容量。
func fitWritingHistory(history writingActualHistory, fits func(writingActualHistory, map[string]any) bool) bool {
	if fits(history, nil) {
		return true
	}
	note := map[string]any{
		"evidence_quotes_shortened": true,
		"recalled_omitted":          0,
		"resolved_threads_omitted":  0,
		"note":                      "受来源容量限制，证据原文只保留开头，部分较早章节的细节和已解决线索未提供；未提供的内容不代表没有发生，不得据此改写已有事实。",
	}
	history = shortenWritingHistoryQuotes(history)
	if fits(history, note) {
		return true
	}
	for len(history.Recalled) > 0 {
		history.Recalled = history.Recalled[1:]
		history.RecallOmitted++
		note["recalled_omitted"] = history.RecallOmitted
		if fits(history, note) {
			return true
		}
	}
	if len(history.ResolvedThreads) > 0 {
		note["resolved_threads_omitted"] = len(history.ResolvedThreads)
		history.ResolvedThreads = []writingThread{}
		return fits(history, note)
	}
	return false
}

func shortenWritingHistoryQuotes(history writingActualHistory) writingActualHistory {
	shorten := func(quote string) string {
		runes := []rune(quote)
		if len(runes) <= writingEvidenceQuoteLimit {
			return quote
		}
		return string(runes[:writingEvidenceQuoteLimit]) + "…"
	}
	threads := func(items []writingThread) []writingThread {
		result := make([]writingThread, len(items))
		for index, thread := range items {
			thread.Quote = shorten(thread.Quote)
			result[index] = thread
		}
		return result
	}
	characters := make([]writingCharacterState, len(history.Characters))
	for index, state := range history.Characters {
		state.Quote = shorten(state.Quote)
		characters[index] = state
	}
	recalled := make([]map[string]any, len(history.Recalled))
	for index, item := range history.Recalled {
		facts := item["facts"].([]writingEvidence)
		shortFacts := make([]writingEvidence, len(facts))
		for i, fact := range facts {
			fact.Quote = shorten(fact.Quote)
			shortFacts[i] = fact
		}
		findings := item["findings"].([]writingFinding)
		shortFindings := make([]writingFinding, len(findings))
		for i, finding := range findings {
			finding.Evidence = shorten(finding.Evidence)
			shortFindings[i] = finding
		}
		recalled[index] = map[string]any{
			"source":         item["source"],
			"ordinal":        item["ordinal"],
			"synopsis":       item["synopsis"],
			"facts":          shortFacts,
			"thread_changes": threads(item["thread_changes"].([]writingThread)),
			"findings":       shortFindings,
		}
	}
	history.Characters = characters
	history.OpenThreads = threads(history.OpenThreads)
	history.ResolvedThreads = threads(history.ResolvedThreads)
	history.Recalled = recalled
	return history
}
