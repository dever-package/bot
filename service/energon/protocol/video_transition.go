package protocol

import "strings"

const VideoTransitionNone = "none"

var videoTransitionFFmpegNames = map[string]string{
	VideoTransitionNone: "",
	"fade":              "fade",
	"crossfade":         "dissolve",
	"fadeblack":         "fadeblack",
	"fadewhite":         "fadewhite",
	"wipeleft":          "wipeleft",
	"wiperight":         "wiperight",
	"wipeup":            "wipeup",
	"wipedown":          "wipedown",
	"slideleft":         "slideleft",
	"slideright":        "slideright",
	"slideup":           "slideup",
	"slidedown":         "slidedown",
	"smoothleft":        "smoothleft",
	"smoothright":       "smoothright",
	"smoothup":          "smoothup",
	"smoothdown":        "smoothdown",
	"zoomin":            "zoomin",
	"circleopen":        "circleopen",
	"circleclose":       "circleclose",
	"coverleft":         "coverleft",
	"coverright":        "coverright",
	"coverup":           "coverup",
	"coverdown":         "coverdown",
	"revealleft":        "revealleft",
	"revealright":       "revealright",
	"revealup":          "revealup",
	"revealdown":        "revealdown",
}

func NormalizeVideoTransitionType(value string) (string, bool) {
	transitionType := strings.ToLower(strings.TrimSpace(value))
	if transitionType == "" {
		transitionType = VideoTransitionNone
	}
	_, ok := videoTransitionFFmpegNames[transitionType]
	return transitionType, ok
}

func FFmpegVideoTransitionName(value string) (string, bool) {
	transitionType, ok := NormalizeVideoTransitionType(value)
	if !ok {
		return "", false
	}
	return videoTransitionFFmpegNames[transitionType], true
}
