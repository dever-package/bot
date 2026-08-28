package energon

import (
	"strings"

	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

func ManagedServiceProtocolLabel(protocol string) (string, bool) {
	switch strings.ToLower(strings.TrimSpace(protocol)) {
	case botprocessor.ProtocolLocal:
		return "本地处理器", true
	case botwebcontent.Protocol:
		return "自媒体", true
	default:
		return "", false
	}
}
