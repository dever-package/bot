package skill

import agentmodel "my/package/bot/model/agent"

func LimitsFromRuntimeConfig(config agentmodel.RuntimeConfig) Limits {
	defaults := DefaultLimits()
	return Limits{
		MetadataMaxSkills:     positiveInt(config.SkillMetadataMaxSkills, defaults.MetadataMaxSkills),
		MetadataFieldMaxRunes: positiveInt(config.SkillMetadataFieldMaxLength, defaults.MetadataFieldMaxRunes),
		SkillFileMaxBytes:     int64(positiveInt(config.SkillFileMaxBytes, int(defaults.SkillFileMaxBytes))),
		LoadedContentMaxRunes: positiveInt(config.SkillLoadedContentMaxLength, defaults.LoadedContentMaxRunes),
	}
}

func positiveInt(value int, fallback int) int {
	if value > 0 {
		return value
	}
	return fallback
}
