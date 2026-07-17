package artifact

import (
	agentmodel "github.com/dever-package/bot/model/agent"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type JobSnapshot struct {
	Agent           agentmodel.Agent                 `json:"agent"`
	Transport       JobTransport                     `json:"transport"`
	MediaReferences []runtimeprovider.MediaReference `json:"media_references"`
	Scope           runtimescope.Scope               `json:"scope,omitempty"`
}

// JobTransport deliberately excludes request headers. Persistent jobs must not
// store access tokens or other per-request credentials.
type JobTransport struct {
	Method string `json:"method,omitempty"`
	Host   string `json:"host,omitempty"`
	Path   string `json:"path,omitempty"`
}

type JobRequest struct {
	DocumentID    uint64
	BlockID       uint64
	SessionID     uint64
	MessageID     uint64
	RunID         uint64
	Call          botprotocol.ToolCall
	Kind          string
	Arguments     map[string]any
	Snapshot      JobSnapshot
	DeferDispatch bool
}
