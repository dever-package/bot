package bot

import "embed"

// PageFS 内嵌 bot 模块页面配置，便于后续按 front 嵌入页机制复用。
//
//go:embed page
var PageFS embed.FS

// FrontFS 内嵌 bot 前端插件静态产物。发布前由 dever front build bot 写入 front/dist。
//
//go:embed front/dist
var FrontFS embed.FS
