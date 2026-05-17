package skill

import (
	"fmt"
	agentmodel "my/package/bot/model/agent"
	"strings"
)

const (
	Root       = "data/skills"
	TmpRoot    = "data/skills/.tmp"
	EntryFile  = "SKILL.md"
	TimeoutSec = 120
	HTTPMaxLen = 256 * 1024
)

type Limits struct {
	MetadataMaxSkills     int
	MetadataFieldMaxRunes int
	SkillFileMaxBytes     int64
	LoadedContentMaxRunes int
}

type Entry struct {
	ID          uint64
	Key         string
	Name        string
	Description string
	Triggers    []string
	InstallPath string
	EntryFile   string
	Content     string
}

type Catalog struct {
	PackID          uint64
	Metadata        string
	LoadedContent   string
	Warning         string
	Entries         []Entry
	MetadataEntries []Entry
	Loaded          []Entry
}

type ParsedFile struct {
	Key         string
	Name        string
	Description string
	Triggers    []string
	Content     string
	Manifest    map[string]any
	Hash        string
}

func DefaultLimits() Limits {
	return Limits{
		MetadataMaxSkills:     agentmodel.DefaultRuntimeSkillMetadataMaxSkills,
		MetadataFieldMaxRunes: agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength,
		SkillFileMaxBytes:     int64(agentmodel.DefaultRuntimeSkillFileMaxBytes),
		LoadedContentMaxRunes: agentmodel.DefaultRuntimeSkillLoadedContentMaxLength,
	}
}

func BuildCatalog(packID uint64, entries []Entry, limits Limits) Catalog {
	limits = normalizeLimits(limits)
	metadataEntries, warnings := metadataEntries(entries, limits)
	return Catalog{
		PackID:          packID,
		Entries:         entries,
		MetadataEntries: metadataEntries,
		Metadata:        renderMetadata(metadataEntries),
		Warning:         strings.Join(warnings, "\n"),
	}
}

func (catalog Catalog) AvailableKeys() []string {
	return entryKeys(catalog.Entries)
}

func (catalog Catalog) MetadataKeys() []string {
	return entryKeys(catalog.MetadataEntries)
}

func (catalog Catalog) LoadedKeys() []string {
	return entryKeys(catalog.Loaded)
}

func (catalog Catalog) SelectableEntries() []Entry {
	if len(catalog.MetadataEntries) > 0 {
		return catalog.MetadataEntries
	}
	return catalog.Entries
}

func normalizeLimits(limits Limits) Limits {
	defaults := DefaultLimits()
	if limits.MetadataMaxSkills <= 0 {
		limits.MetadataMaxSkills = defaults.MetadataMaxSkills
	}
	if limits.MetadataFieldMaxRunes <= 0 {
		limits.MetadataFieldMaxRunes = defaults.MetadataFieldMaxRunes
	}
	if limits.SkillFileMaxBytes <= 0 {
		limits.SkillFileMaxBytes = defaults.SkillFileMaxBytes
	}
	if limits.LoadedContentMaxRunes <= 0 {
		limits.LoadedContentMaxRunes = defaults.LoadedContentMaxRunes
	}
	return limits
}

func metadataEntries(entries []Entry, limits Limits) ([]Entry, []string) {
	count := len(entries)
	if count > limits.MetadataMaxSkills {
		count = limits.MetadataMaxSkills
	}
	result := make([]Entry, 0, count)
	warnings := make([]string, 0)
	if len(entries) > limits.MetadataMaxSkills {
		warnings = append(warnings, fmt.Sprintf("技能 metadata 超过 %d 个，仅注入前 %d 个。", limits.MetadataMaxSkills, limits.MetadataMaxSkills))
	}
	for index := 0; index < count; index++ {
		entry := entries[index]
		entry.Triggers = append([]string(nil), entry.Triggers...)
		var truncated bool
		entry.Name, truncated = truncateRunes(entry.Name, limits.MetadataFieldMaxRunes)
		if truncated {
			warnings = append(warnings, fmt.Sprintf("技能 %s 名称超过 %d 字，metadata 已截断。", entry.Key, limits.MetadataFieldMaxRunes))
		}
		entry.Description, truncated = truncateRunes(entry.Description, limits.MetadataFieldMaxRunes)
		if truncated {
			warnings = append(warnings, fmt.Sprintf("技能 %s 描述超过 %d 字，metadata 已截断。", entry.Key, limits.MetadataFieldMaxRunes))
		}
		for triggerIndex, trigger := range entry.Triggers {
			entry.Triggers[triggerIndex], truncated = truncateRunes(trigger, limits.MetadataFieldMaxRunes)
			if truncated {
				warnings = append(warnings, fmt.Sprintf("技能 %s 触发词超过 %d 字，metadata 已截断。", entry.Key, limits.MetadataFieldMaxRunes))
			}
		}
		result = append(result, entry)
	}
	return result, warnings
}

func renderMetadata(entries []Entry) string {
	rows := []string{
		"可用技能:",
		"以下技能来自当前智能体绑定的技能方案，只提供流程规范、领域知识、工具使用说明或格式约束。",
		"如需使用某个技能，先在内部选择对应 key，再参考已加载技能正文；技能不是 Energon 能力，不能作为 call_power.power。",
	}
	if len(entries) == 0 {
		return strings.Join(append(rows, "- 暂无可用技能。"), "\n")
	}
	for _, entry := range entries {
		line := fmt.Sprintf("- key: %s, name: %s", entry.Key, entry.Name)
		if entry.Description != "" {
			line += ", description: " + entry.Description
		}
		if len(entry.Triggers) > 0 {
			line += ", triggers: " + strings.Join(entry.Triggers, "、")
		}
		rows = append(rows, line)
	}
	return strings.Join(rows, "\n")
}

func entryKeys(entries []Entry) []string {
	keys := make([]string, 0, len(entries))
	for _, entry := range entries {
		keys = append(keys, entry.Key)
	}
	return keys
}
