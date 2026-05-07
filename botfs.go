package bot

import "embed"

// PageFS 内嵌 bot 模块页面配置，便于后续按 front 嵌入页机制复用。
//
//go:embed page
var PageFS embed.FS
