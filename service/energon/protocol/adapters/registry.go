package adapters

import botprotocol "my/package/bot/service/energon/protocol"

func DefaultRegistry() *botprotocol.Registry {
	return botprotocol.NewRegistry(OpenAIAdapter{}, ShemicAdapter{}, DoubaoAdapter{}, RhApiAdapter{}, RhFlowAdapter{})
}
