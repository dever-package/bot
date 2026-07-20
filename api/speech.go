package api

import (
	"bufio"
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/shemic/dever/server"

	energonservice "github.com/dever-package/bot/service/energon"
	botstream "github.com/dever-package/bot/service/energon/stream"
)

type Speech struct{}

func (Speech) GetAudio(c *server.Context) error {
	subscription, err := energonservice.SubscribeAudioStream(
		QueryText(c, "request_id", "requestId"),
		QueryText(c, "token"),
	)
	if err != nil {
		return c.Error(err)
	}

	fiberCtx, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		subscription.Close()
		return fmt.Errorf("音频流: 当前 HTTP 框架不支持流式响应")
	}
	ctx := c.Context()
	fiberCtx.Status(fiber.StatusOK)
	fiberCtx.Set("Content-Type", subscription.MIME)
	fiberCtx.Set("Cache-Control", "no-store, no-transform")
	fiberCtx.Set("Connection", "keep-alive")
	fiberCtx.Set("Content-Disposition", "inline")
	fiberCtx.Set("Referrer-Policy", "no-referrer")
	fiberCtx.Set("X-Accel-Buffering", "no")
	fiberCtx.Context().SetBodyStreamWriter(func(writer *bufio.Writer) {
		serveAudioSubscription(ctx, writer, subscription)
	})
	return nil
}

func serveAudioSubscription(ctx context.Context, writer *bufio.Writer, subscription *botstream.AudioSubscription) {
	defer subscription.Close()
	for _, chunk := range subscription.Initial {
		if !writeAudioChunk(writer, chunk) {
			return
		}
	}
	if subscription.Done {
		return
	}

	for {
		select {
		case <-ctx.Done():
			return
		case chunk, ok := <-subscription.Events():
			if !ok || !writeAudioChunk(writer, chunk) {
				return
			}
		}
	}
}

func writeAudioChunk(writer *bufio.Writer, chunk []byte) bool {
	if len(chunk) == 0 {
		return true
	}
	if _, err := writer.Write(chunk); err != nil {
		return false
	}
	return writer.Flush() == nil
}
