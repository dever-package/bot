package test

import "testing"

func TestBotExistenceReadOptimization(t *testing.T) {
	t.Run("stream scope", func(t *testing.T) {
		runBotReadFixture(t, "team", "bot_stream_existence_read_test.go", "^TestBotStreamExistenceRead$")
	})
	t.Run("active node scope", func(t *testing.T) {
		runBotReadFixture(t, "project", "bot_node_existence_read_test.go", "^TestBotNodeExistenceRead$")
	})
}
