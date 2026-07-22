package capacity

import "testing"

func TestParseTokenCapacity(t *testing.T) {
	tests := []struct {
		name  string
		value any
		want  int
	}{
		{name: "empty", value: "", want: 0},
		{name: "plain integer", value: "128000", want: 128000},
		{name: "lowercase kilo", value: "64k", want: 64000},
		{name: "uppercase kilo", value: "10K", want: 10000},
		{name: "decimal mega", value: "1.05M", want: 1050000},
		{name: "lossless mega", value: "1.000001m", want: 1000001},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := Parse(test.value)
			if err != nil {
				t.Fatalf("Parse(%v) returned error: %v", test.value, err)
			}
			if got != test.want {
				t.Fatalf("Parse(%v) = %d, want %d", test.value, got, test.want)
			}
		})
	}
}

func TestParseTokenCapacityRejectsInvalidValues(t *testing.T) {
	for _, value := range []any{"-1K", "1.5", "10G", "2147.483648M"} {
		if _, err := Parse(value); err == nil {
			t.Fatalf("Parse(%v) should fail", value)
		}
	}
}

func TestFormatTokenCapacityRoundTrip(t *testing.T) {
	for _, value := range []int{0, 999, 1000, 64001, 1050000, 1000001, 1<<31 - 1} {
		formatted := Format(value)
		parsed, err := Parse(formatted)
		if err != nil {
			t.Fatalf("Parse(Format(%d)) returned error: %v", value, err)
		}
		if parsed != value {
			t.Fatalf("Parse(Format(%d)) = %d via %q", value, parsed, formatted)
		}
	}
}
