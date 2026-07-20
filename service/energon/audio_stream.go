package energon

import (
	"context"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func SubscribeAudioStream(requestID string, token string) (*botstream.AudioSubscription, error) {
	return botstream.SharedAudioRelay().Subscribe(requestID, token)
}

func (s GatewayService) audioStreamWriter(
	ctx context.Context,
	requestID string,
	writeOutput func(botprotocol.Output) error,
) bottask.BinaryStreamWriter {
	announced := false
	return func(payload botprovider.BinaryPayload) error {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}
		if len(payload.Content) == 0 {
			return nil
		}
		descriptor, err := s.audioRelay().Start(requestID, payload.MIME)
		if err != nil {
			return err
		}
		if err := s.audioRelay().Publish(requestID, payload.Content); err != nil {
			return err
		}
		if announced || writeOutput == nil {
			return nil
		}
		announced = true
		return writeOutput(botprotocol.Output{
			"event":  "audio_ready",
			"text":   "音频生成中",
			"audios": []any{descriptor.URL},
			"meta": map[string]any{
				"streaming_audio": true,
				"mime":            descriptor.MIME,
			},
		})
	}
}

func (s GatewayService) audioRelay() *botstream.AudioRelay {
	if s.audioStreams != nil {
		return s.audioStreams
	}
	return botstream.SharedAudioRelay()
}
