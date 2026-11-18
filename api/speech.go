package api

import (
	"bufio"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gofiber/fiber/v2"
	"github.com/shemic/dever/server"

	energonservice "github.com/dever-package/bot/service/energon"
	"github.com/dever-package/bot/service/worker"
)

type Speech struct{}

func (Speech) GetAudio(c *server.Context) error {
	response, err := worker.Open(c.Context(), energonservice.WorkerAudioPath, url.Values{
		"request_id": {QueryText(c, "request_id", "requestId")},
		"token":      {QueryText(c, "token")},
	})
	if err != nil {
		return c.Error(err)
	}
	if response.StatusCode != http.StatusOK {
		defer response.Body.Close()
		message, err := io.ReadAll(io.LimitReader(response.Body, 4096))
		if err != nil {
			return c.Error(err)
		}
		return c.Error(fmt.Errorf("音频流: %s", message))
	}

	fiberCtx, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		response.Body.Close()
		return fmt.Errorf("音频流: 当前 HTTP 框架不支持流式响应")
	}
	fiberCtx.Status(fiber.StatusOK)
	fiberCtx.Set("Content-Type", response.Header.Get("Content-Type"))
	fiberCtx.Set("Cache-Control", "no-store, no-transform")
	fiberCtx.Set("Connection", "keep-alive")
	fiberCtx.Set("Content-Disposition", "inline")
	fiberCtx.Set("Referrer-Policy", "no-referrer")
	fiberCtx.Set("X-Accel-Buffering", "no")
	fiberCtx.Context().SetBodyStreamWriter(func(writer *bufio.Writer) {
		defer response.Body.Close()
		buffer := make([]byte, 32*1024)
		for {
			n, readErr := response.Body.Read(buffer)
			if n > 0 {
				if _, err := writer.Write(buffer[:n]); err != nil {
					return
				}
				if err := writer.Flush(); err != nil {
					return
				}
			}
			if readErr != nil {
				return
			}
		}
	})
	return nil
}
