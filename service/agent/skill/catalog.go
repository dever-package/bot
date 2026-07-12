package skill

import agentmodel "github.com/dever-package/bot/model/agent"

const (
	Root       = "data/skills"
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
	SourceType  string
	Triggers    []string
	Domains     []string
	Targets     []string
	InstallPath string
	EntryFile   string
	Manifest    string
	Content     string
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

func MetadataEntries(entries []Entry, limits Limits) []Entry {
	limits = normalizeLimits(limits)
	count := len(entries)
	if count > limits.MetadataMaxSkills {
		count = limits.MetadataMaxSkills
	}
	result := make([]Entry, 0, count)
	for index := 0; index < count; index++ {
		entry := entries[index]
		entry.Triggers = append([]string(nil), entry.Triggers...)
		entry.Name, _ = truncateRunes(entry.Name, limits.MetadataFieldMaxRunes)
		entry.Description, _ = truncateRunes(entry.Description, limits.MetadataFieldMaxRunes)
		for triggerIndex, trigger := range entry.Triggers {
			entry.Triggers[triggerIndex], _ = truncateRunes(trigger, limits.MetadataFieldMaxRunes)
		}
		result = append(result, entry)
	}
	return result
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
