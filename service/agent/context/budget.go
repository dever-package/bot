package agentcontext

func defaultBudget() Budget {
	return Budget{
		HistoryRows:             8,
		HistoryValueRunes:       900,
		HistoryTotalRunes:       5200,
		BaselineSummaryRunes:    1200,
		MemoryQueryRunes:        1200,
		PlannerInputRunes:       2400,
		SkillSelectorInputRunes: 2200,
	}
}
