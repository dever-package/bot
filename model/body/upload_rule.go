package body

// Built-in upload rule IDs are part of the seed-data contract shared by model
// definitions and runtime upload routing.
const (
	BuiltinUploadRuleImageID      uint64 = 1
	BuiltinUploadRuleVideoID      uint64 = 2
	BuiltinUploadRuleAudioID      uint64 = 3
	BuiltinUploadRuleDocumentID   uint64 = 4
	BuiltinUploadRuleAttachmentID uint64 = 6
	BuiltinUploadRuleUserFileID   uint64 = 7
)
