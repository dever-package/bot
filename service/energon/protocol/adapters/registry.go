package adapters

import botprotocol "github.com/dever-package/bot/service/energon/protocol"

func DefaultRegistry() *botprotocol.Registry {
	return botprotocol.NewRegistry(OpenAIAdapter{}, ShemicAdapter{}, DoubaoAdapter{}, RhApiAdapter{}, RhFlowAdapter{})
}
