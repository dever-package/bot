package frontplugin

import (
	"errors"
	"mime"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/shemic/dever/server"

	botroot "my/package/bot"
)

const (
	mountPath = "/_admin/plugins/bot"
	diskDir   = "package/bot/front/dist"
	embedDir  = "front/dist"
)

// Register 挂载 bot 前端插件静态资源。
func Register(s server.Server) {
	if s == nil {
		return
	}
	s.Get(mountPath, openFile)
	s.Get(mountPath+"/*", openFile)
}

func openFile(c *server.Context) error {
	raw, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		return c.Error("当前环境不支持静态文件输出", http.StatusInternalServerError)
	}

	rel := cleanAssetPath(c.Input("*"))
	if file, err := resolveDiskFile(rel); err == nil {
		setContentType(raw, rel)
		return raw.SendFile(file)
	} else if !errors.Is(err, os.ErrNotExist) {
		return c.Error(err, http.StatusNotFound)
	}

	content, err := readEmbeddedFile(rel)
	if err != nil {
		return c.Error(err, http.StatusNotFound)
	}
	setContentType(raw, rel)
	return raw.Send(content)
}

func resolveDiskFile(rel string) (string, error) {
	root, err := filepath.Abs(diskDir)
	if err != nil {
		return "", err
	}

	file := filepath.Join(root, filepath.FromSlash(rel))
	if err := ensureInside(root, file); err != nil {
		return "", err
	}
	info, err := os.Stat(file)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return "", os.ErrNotExist
		}
		return "", err
	}
	if info.IsDir() {
		return "", os.ErrNotExist
	}
	return file, nil
}

func readEmbeddedFile(rel string) ([]byte, error) {
	content, err := botroot.FrontFS.ReadFile(path.Join(embedDir, filepath.ToSlash(rel)))
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, os.ErrNotExist
		}
		return nil, err
	}
	return content, nil
}

func cleanAssetPath(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || value == "/" {
		return "manifest.json"
	}
	value = strings.TrimPrefix(path.Clean("/"+value), "/")
	if value == "." {
		return "manifest.json"
	}
	return value
}

func setContentType(raw *fiber.Ctx, rel string) {
	contentType := mime.TypeByExtension(path.Ext(filepath.ToSlash(rel)))
	if contentType == "" {
		return
	}
	raw.Set("Content-Type", contentType)
}

func ensureInside(root, file string) error {
	root = filepath.Clean(root)
	file = filepath.Clean(file)
	rel, err := filepath.Rel(root, file)
	if err != nil {
		return err
	}
	if rel == "." || (!strings.HasPrefix(rel, ".."+string(filepath.Separator)) && rel != "..") {
		return nil
	}
	return os.ErrPermission
}
