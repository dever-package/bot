package bot

import "embed"

// ManifestFS 内嵌 bot 组件声明。
//
//go:embed dever.json
var ManifestFS embed.FS

// PageFS 内嵌 bot 页面配置和站点默认静态资源。
//
//go:embed front/page/*/*.json front/page/*/*/*.json front/page/*/*/*/*.json front/assets
var PageFS embed.FS

// FrontFS 内嵌 bot 前端插件静态产物。发布前由 dever front build bot 写入 front/dist。
//
//go:embed front/dist
var FrontFS embed.FS
