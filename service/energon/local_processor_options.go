package energon

import (
	"github.com/shemic/dever/server"

	botprocessor "github.com/dever-package/bot/service/energon/processor"
)

type LocalProcessorService struct{}

func (LocalProcessorService) ProviderLoadOptions(_ *server.Context, _ []any) any {
	return botprocessor.DefaultRegistry().Options()
}
