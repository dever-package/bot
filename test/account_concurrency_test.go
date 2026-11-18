package test

import "testing"

func TestAccountConcurrencyField(t *testing.T) {
	runBotReadFixture(t, "energon/hook", "account_concurrency_test.go", "^TestAccountConcurrencyField$")
}

func TestServiceAccountBinding(t *testing.T) {
	runBotReadFixture(t, "energon/hook", "account_concurrency_test.go", "^TestServiceAccountBinding$")
}
