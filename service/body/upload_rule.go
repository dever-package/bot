package body

import bodymodel "github.com/dever-package/bot/model/body"

// UploadPurpose identifies a built-in upload rule by business purpose. The
// numeric IDs are owned by package/front seed data and must stay centralized
// here so Body callers do not duplicate that external contract.
type UploadPurpose string

const (
	UploadPurposeImage      UploadPurpose = "image"
	UploadPurposeVideo      UploadPurpose = "video"
	UploadPurposeAudio      UploadPurpose = "audio"
	UploadPurposeDocument   UploadPurpose = "document"
	UploadPurposeAttachment UploadPurpose = "attachment"
	UploadPurposeUserFile   UploadPurpose = "user_file"
)

var builtinUploadRuleIDs = map[UploadPurpose]uint64{
	UploadPurposeImage:      bodymodel.BuiltinUploadRuleImageID,
	UploadPurposeVideo:      bodymodel.BuiltinUploadRuleVideoID,
	UploadPurposeAudio:      bodymodel.BuiltinUploadRuleAudioID,
	UploadPurposeDocument:   bodymodel.BuiltinUploadRuleDocumentID,
	UploadPurposeAttachment: bodymodel.BuiltinUploadRuleAttachmentID,
	UploadPurposeUserFile:   bodymodel.BuiltinUploadRuleUserFileID,
}

func BuiltinUploadRuleID(purpose UploadPurpose) uint64 {
	return builtinUploadRuleIDs[purpose]
}

func clientUploadRulePayload() map[string]uint64 {
	return map[string]uint64{
		"image":  BuiltinUploadRuleID(UploadPurposeImage),
		"video":  BuiltinUploadRuleID(UploadPurposeVideo),
		"audio":  BuiltinUploadRuleID(UploadPurposeAudio),
		"file":   BuiltinUploadRuleID(UploadPurposeUserFile),
		"text":   BuiltinUploadRuleID(UploadPurposeUserFile),
		"avatar": BuiltinUploadRuleID(UploadPurposeImage),
	}
}
