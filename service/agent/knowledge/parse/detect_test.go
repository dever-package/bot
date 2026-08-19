package parse

import "testing"

func TestParseFileSupportsStructuredMIMEWithoutExtension(t *testing.T) {
	tests := []struct {
		name       string
		mimeType   string
		content    string
		wantParser string
	}{
		{
			name:       "json",
			mimeType:   "application/json; charset=utf-8",
			content:    `{"name":"knowledge"}`,
			wantParser: "json",
		},
		{
			name:       "xml",
			mimeType:   "application/xml; charset=utf-8",
			content:    "<knowledge>content</knowledge>",
			wantParser: "text",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if !CanParseLocally("", test.mimeType) {
				t.Fatalf("CanParseLocally() rejected %q", test.mimeType)
			}

			result, err := ParseFile(Request{
				MimeType: test.mimeType,
				Content:  test.content,
			})
			if err != nil {
				t.Fatalf("ParseFile() error = %v", err)
			}
			if got := result.Raw["parser"]; got != test.wantParser {
				t.Fatalf("ParseFile() parser = %v, want %q", got, test.wantParser)
			}
		})
	}
}
