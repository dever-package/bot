package energon

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
	bottask "github.com/dever-package/bot/service/energon/task"
	frontupload "github.com/dever-package/front/service/upload"
	"strings"
)

// 原始结果先落在应用持久卷，检查点只存引用；转存失败不能丢弃内存文件。
type mediaReceipt struct {
	Type        string                        `json:"type"`
	Value       any                           `json:"value,omitempty"`
	Files       []mediaReceiptFile            `json:"files,omitempty"`
	Attachments []mediaReceiptFile            `json:"attachments,omitempty"`
	Lyrics      string                        `json:"lyrics,omitempty"`
	Text        string                        `json:"text,omitempty"`
	Meta        map[string]any                `json:"meta,omitempty"`
	References  map[string][]mediaReceiptFile `json:"references,omitempty"`
	Identity    string                        `json:"identity,omitempty"`
	Persisted   bool                          `json:"persisted,omitempty"`
}
type mediaReceiptFile struct {
	Blob string         `json:"blob"`
	MIME string         `json:"mime"`
	Name string         `json:"name,omitempty"`
	Meta map[string]any `json:"meta,omitempty"`
}

func mediaReceiptID(token string) string {
	return mediaContentID([]byte(token))
}

func mediaContentID(content []byte) string {
	sum := sha256.Sum256(content)
	return hex.EncodeToString(sum[:])
}

func cleanupMediaReceipt(result botprotocol.Output) {
	payload := botprotocol.NormalizeMap(result["json"])
	id, ok := payload["media_receipt"].(string)
	if !ok {
		return
	}
	directory, err := mediaReceiptPath(id)
	if err != nil {
		return
	}
	if err = os.RemoveAll(directory); err != nil {
		slog.Warn("已保存媒体的暂存文件清理失败", "receipt", id, "error", err)
	}
}
func mediaReceiptPath(id string) (string, error) {
	decoded, err := hex.DecodeString(id)
	if err != nil || len(decoded) != sha256.Size {
		return "", fmt.Errorf("媒体结果回执无效")
	}
	return filepath.Join(botruntimeconfig.Load().MediaResultDirectory, id), nil
}
func writeMediaReceipt(ctx context.Context, token string, value any, identity ...string) (botprotocol.Output, error) {
	id := mediaReceiptID(token)
	directory, _ := mediaReceiptPath(id)
	if err := os.MkdirAll(directory, 0700); err != nil {
		return nil, err
	}
	receipt := mediaReceipt{Type: "output", Value: value}
	if len(identity) > 0 {
		receipt.Identity = identity[0]
	}
	var files []botprovider.BinaryPayload
	if binary, ok := botprovider.AsBinaryPayload(value); ok {
		receipt.Type = "binary"
		files = []botprovider.BinaryPayload{binary}
	}
	if binary, ok := botprovider.AsBinaryMediaOutput(value); ok {
		receipt.Type = "collection"
		files = binary.Files
		receipt.Lyrics = binary.Lyrics
		receipt.Text = binary.Text
		receipt.Meta = binary.Meta
		for _, file := range binary.Attachments {
			stored, err := writeReceiptBlob(directory, file.Payload)
			if err != nil {
				return nil, err
			}
			stored.Name = file.Name
			receipt.Attachments = append(receipt.Attachments, stored)
		}
	}
	if receipt.Type != "output" {
		receipt.Value = nil
	} else {
		output := powerOutputFromData(value)
		receipt.Value = output
		for _, rule := range generatedMediaRules {
			media := botprotocol.NormalizeMediaList(output, rule.kind)
			for _, source := range media {
				var stored mediaReceiptFile
				if strings.HasPrefix(source, "data:") { // 数据 URI 已在持久文件内，无需下载。
					stored.Name = source
				} else {
					localPath, _, mime, cleanup, err := frontupload.DownloadURLResource(ctx, frontupload.ImportURLResourceInput{RuleID: rule.ruleID, Kind: rule.kind, URL: source})
					if err != nil {
						return nil, fmt.Errorf("暂存生成媒体下载失败: %w", err)
					}
					content, err := os.ReadFile(localPath)
					cleanup()
					if err != nil {
						return nil, err
					}
					stored, err = writeReceiptBlob(directory, botprovider.BinaryPayload{MIME: mime, Content: content})
					if err != nil {
						return nil, err
					}
				}
				if receipt.References == nil {
					receipt.References = map[string][]mediaReceiptFile{}
				}
				receipt.References[rule.key] = append(receipt.References[rule.key], stored)
			}
			if len(media) > 0 {
				output[rule.key] = nil
			}
		}
	}
	for _, file := range files {
		stored, err := writeReceiptBlob(directory, file)
		if err != nil {
			return nil, err
		}
		receipt.Files = append(receipt.Files, stored)
	}
	encoded, err := json.Marshal(receipt)
	if err != nil {
		return nil, err
	}
	if err = writeReceiptFile(directory, "result.json", encoded); err != nil {
		return nil, err
	}
	return botprotocol.Output{"json": map[string]any{"media_receipt": id}}, nil
}

// 非工作台的直接媒体调用同样保存原始结果；这只是媒体回执，不创建第二套运行记录。
func directMediaReceiptIdentity(prepared remoteCallPreparation) (token, identity string) {
	request := prepared.Request
	token = fmt.Sprintf("direct:%d:%d:%s", request.Billing.UserID, request.Billing.ProjectID, request.RequestID)
	selected := prepared.Selected
	encoded, _ := json.Marshal([]any{selected.Power.ID, selected.PowerTarget.ID, selected.Provider.ID, selected.Account.ID, selected.Service.ID, selected.ServiceEndpoint.ID, prepared.NativeInput.Mapped})
	return token, mediaReceiptID(string(encoded))
}
func restoreDirectMediaReceipt(ctx context.Context, prepared remoteCallPreparation) (any, bool, error) {
	if bottask.Store(ctx) != nil {
		return nil, false, nil
	}
	if _, media := generatedMediaRuleForKind(prepared.Selected.Power.Kind); !media {
		return nil, false, nil
	}
	token, identity := directMediaReceiptIdentity(prepared)
	directory, _ := mediaReceiptPath(mediaReceiptID(token))
	encoded, err := os.ReadFile(filepath.Join(directory, "result.json"))
	if errors.Is(err, os.ErrNotExist) {
		return nil, false, nil
	}
	if err != nil {
		return nil, false, err
	}
	var receipt mediaReceipt
	if err = json.Unmarshal(encoded, &receipt); err != nil {
		return nil, false, err
	}
	if receipt.Identity != identity {
		return nil, false, executionError(fmt.Errorf("原请求身份对应的生成参数已改变，禁止重复提交"))
	}
	if receipt.Persisted {
		return receipt.Value, true, nil
	}
	value, err := readMediaReceipt(botprotocol.Output{"json": map[string]any{"media_receipt": mediaReceiptID(token)}})
	return value, false, err
}
func saveDirectMediaReceipt(ctx context.Context, prepared remoteCallPreparation, value any, persisted bool) error {
	if bottask.Store(ctx) != nil {
		return nil
	}
	if _, media := generatedMediaRuleForKind(prepared.Selected.Power.Kind); !media {
		return nil
	}
	token, identity := directMediaReceiptIdentity(prepared)
	if !persisted {
		_, err := writeMediaReceipt(context.WithoutCancel(ctx), token, value, identity)
		return err
	}
	directory, _ := mediaReceiptPath(mediaReceiptID(token))
	if err := os.MkdirAll(directory, 0700); err != nil {
		return err
	}
	var previous mediaReceipt
	if encoded, readErr := os.ReadFile(filepath.Join(directory, "result.json")); readErr == nil {
		if err := json.Unmarshal(encoded, &previous); err != nil {
			return err
		}
	} else if !errors.Is(readErr, os.ErrNotExist) {
		return readErr
	}
	receipt := mediaReceipt{Type: "output", Value: value, Identity: identity, Persisted: true}
	encoded, err := json.Marshal(receipt)
	if err != nil {
		return err
	}
	if err := writeReceiptFile(directory, "result.json", encoded); err != nil {
		return err
	}
	blobs := append(previous.Files, previous.Attachments...)
	for _, files := range previous.References {
		blobs = append(blobs, files...)
	}
	for _, file := range blobs {
		if file.Blob == "" {
			continue
		}
		if _, err := mediaReceiptPath(file.Blob); err != nil {
			return err
		}
		if err := os.Remove(filepath.Join(directory, file.Blob)); err != nil && !errors.Is(err, os.ErrNotExist) {
			slog.Warn("已保存媒体的暂存文件清理失败", "error", err)
		}
	}
	return nil
}
func writeReceiptBlob(directory string, payload botprovider.BinaryPayload) (mediaReceiptFile, error) {
	id := mediaContentID(payload.Content)
	err := writeReceiptFile(directory, id, payload.Content)
	return mediaReceiptFile{Blob: id, MIME: payload.MIME, Meta: payload.Meta}, err
}
func writeReceiptFile(directory, name string, content []byte) (failure error) {
	file, err := os.CreateTemp(directory, ".pending-")
	if err != nil {
		return err
	}
	defer func() { file.Close(); os.Remove(file.Name()) }()
	if _, err = file.Write(content); err != nil {
		return err
	}
	if err = file.Sync(); err != nil {
		return err
	}
	if err = file.Close(); err != nil {
		return err
	}
	if err = os.Rename(file.Name(), filepath.Join(directory, name)); err != nil {
		return err
	}
	dir, err := os.Open(directory)
	if err != nil {
		return err
	}
	defer dir.Close()
	return dir.Sync()
}
func readMediaReceipt(result botprotocol.Output) (any, error) {
	payload := botprotocol.NormalizeMap(result["json"])
	id, ok := payload["media_receipt"].(string)
	if !ok {
		return result, nil
	}
	directory, err := mediaReceiptPath(id)
	if err != nil {
		return nil, err
	}
	encoded, err := os.ReadFile(filepath.Join(directory, "result.json"))
	if err != nil {
		return nil, fmt.Errorf("读取已生成媒体失败: %w", err)
	}
	var receipt mediaReceipt
	if err = json.Unmarshal(encoded, &receipt); err != nil {
		return nil, err
	}
	if receipt.Type == "output" {
		output := botprotocol.NormalizeMap(receipt.Value)
		for key, files := range receipt.References {
			media := make([]string, 0, len(files))
			for _, file := range files {
				if file.Blob == "" {
					media = append(media, file.Name)
					continue
				}
				if _, err := mediaReceiptPath(file.Blob); err != nil {
					return nil, err
				}
				content, err := os.ReadFile(filepath.Join(directory, file.Blob))
				if err != nil {
					return nil, err
				}
				if mediaContentID(content) != file.Blob {
					return nil, fmt.Errorf("媒体结果文件校验失败")
				}
				media = append(media, "data:"+file.MIME+";base64,"+base64.StdEncoding.EncodeToString(content))
			}
			output[key] = media
		}
		return output, nil
	}
	read := func(file mediaReceiptFile) (botprovider.BinaryPayload, error) {
		if _, err := mediaReceiptPath(file.Blob); err != nil {
			return botprovider.BinaryPayload{}, err
		}
		content, err := os.ReadFile(filepath.Join(directory, file.Blob))
		if err != nil {
			return botprovider.BinaryPayload{}, err
		}
		if mediaContentID(content) != file.Blob {
			return botprovider.BinaryPayload{}, fmt.Errorf("媒体结果文件校验失败")
		}
		return botprovider.BinaryPayload{MIME: file.MIME, Content: content, Meta: file.Meta}, nil
	}
	collection := botprovider.BinaryMediaOutput{Lyrics: receipt.Lyrics, Text: receipt.Text, Meta: receipt.Meta}
	for _, file := range receipt.Files {
		payload, err := read(file)
		if err != nil {
			return nil, err
		}
		collection.Files = append(collection.Files, payload)
	}
	for _, file := range receipt.Attachments {
		payload, err := read(file)
		if err != nil {
			return nil, err
		}
		collection.Attachments = append(collection.Attachments, botprovider.BinaryFile{Name: file.Name, Payload: payload})
	}
	if receipt.Type == "binary" && len(collection.Files) == 1 {
		return collection.Files[0], nil
	}
	if receipt.Type != "collection" {
		return nil, fmt.Errorf("媒体结果回执类型无效")
	}
	return collection, nil
}
