package energon

import (
	"context"
	"net/http"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
)

const WorkerAudioPath = "/audio"

// ServeWorkerAudio observes the worker-owned relay without changing task lifetime.
func ServeWorkerAudio(w http.ResponseWriter, r *http.Request) {
	subscription, err := botstream.SharedAudioRelay().Subscribe(r.URL.Query().Get("request_id"), r.URL.Query().Get("token"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	defer subscription.Close()
	w.Header().Set("Content-Type", subscription.MIME)
	w.Header().Set("Cache-Control", "no-store, no-transform")
	w.Header().Set("Referrer-Policy", "no-referrer")
	controller := http.NewResponseController(w)
	write := func(chunk []byte) bool {
		if _, err := w.Write(chunk); err != nil {
			return false
		}
		return controller.Flush() == nil
	}
	if err := controller.Flush(); err != nil {
		return
	}
	for _, chunk := range subscription.Initial {
		if !write(chunk) {
			return
		}
	}
	if subscription.Done {
		return
	}
	for {
		select {
		case <-r.Context().Done():
			return
		case chunk, ok := <-subscription.Events():
			if !ok || !write(chunk) {
				return
			}
		}
	}
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
