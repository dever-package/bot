package task

import "context"

type observeKey struct{}

// ObserveTerminal keeps checking an already accepted task after its caller has
// stopped waiting. It records the terminal receipt without downloading results.
func (s Service) ObserveTerminal(ctx context.Context, job StreamJob, id string) (StreamResult, error) {
	return s.ResumePolling(context.WithValue(ctx, observeKey{}, true), job, id)
}
func observing(ctx context.Context) bool { value, _ := ctx.Value(observeKey{}).(bool); return value }
