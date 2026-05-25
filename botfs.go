package bot

import "embed"

// PageFS 内嵌 bot 后台页面配置。
//
//go:embed front/page
var PageFS embed.FS

// FrontFS 内嵌 bot 前端插件静态产物。发布前由 dever front build bot 写入 front/dist。
//
//go:embed front/dist
var FrontFS embed.FS
