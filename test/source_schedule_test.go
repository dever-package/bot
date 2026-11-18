package test

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/dever-package/bot/service/energon/schedule"
	"github.com/dever-package/bot/test/runtimefixture"
)

func acquireAccount(t *testing.T, b *schedule.Broker, id string, accountID uint64, limit int) *schedule.Lease {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	lease, err := b.Acquire(ctx, id, id, fmt.Sprint(accountID), []schedule.Account{{ID: accountID, Limit: limit}}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	return lease
}

func releaseAccount(t *testing.T, lease *schedule.Lease) {
	t.Helper()
	if err := lease.Release(context.Background()); err != nil {
		t.Error(err)
	}
}

func TestAccountConcurrencyAtomicLimits(t *testing.T) {
	b := runtimefixture.Redis(t)
	other := *b
	var current, maximum atomic.Int32
	var wg sync.WaitGroup
	failures := make(chan error, 24)
	for i := 0; i < 24; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			broker := b
			if i%2 == 0 {
				broker = &other
			}
			id := fmt.Sprintf("job-%d", i)
			lease, err := broker.Acquire(ctx, id, id, "18", []schedule.Account{{ID: 18, Limit: 3}}, nil, nil)
			if err != nil {
				failures <- err
				return
			}
			n := current.Add(1)
			for {
				old := maximum.Load()
				if n <= old || maximum.CompareAndSwap(old, n) {
					break
				}
			}
			time.Sleep(5 * time.Millisecond)
			current.Add(-1)
			if err := lease.Release(ctx); err != nil {
				failures <- err
			}
		}(i)
	}
	wg.Wait()
	close(failures)
	for err := range failures {
		t.Error(err)
	}
	if maximum.Load() > 3 || maximum.Load() < 2 {
		t.Fatalf("actual concurrency=%d", maximum.Load())
	}
	stats, err := runtimefixture.AccountUsage(context.Background(), b, 18)
	if err != nil || stats["active_tasks"] != 0 || stats["waiting_tasks"] != 0 {
		t.Fatal(stats, err)
	}
}

func TestAccountConcurrencyQueueCancelAndIsolation(t *testing.T) {
	b := runtimefixture.Redis(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	first := acquireAccount(t, b, "first", 18, 2)
	second := acquireAccount(t, b, "second", 18, 2)
	defer releaseAccount(t, second)
	waiting := make(chan int, 1)
	third := make(chan *schedule.Lease, 1)
	failed := make(chan error, 1)
	go func() {
		lease, err := b.Acquire(ctx, "third", "third", "18", []schedule.Account{{ID: 18, Limit: 2}}, func(n int) { waiting <- n }, nil)
		if err != nil {
			failed <- err
		} else {
			third <- lease
		}
	}()
	select {
	case n := <-waiting:
		if n != 1 {
			t.Fatal(n)
		}
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	independent := acquireAccount(t, b, "another-account", 19, 1)
	releaseAccount(t, independent)
	releaseAccount(t, first)
	select {
	case lease := <-third:
		releaseAccount(t, lease)
	case err := <-failed:
		t.Fatal(err)
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}

	waiter, stop := context.WithCancel(ctx)
	queued := make(chan struct{}, 1)
	done := make(chan error, 1)
	go func() {
		_, err := b.Acquire(waiter, "canceled", "canceled", "18", []schedule.Account{{ID: 18, Limit: 1}}, func(int) { queued <- struct{}{} }, nil)
		done <- err
	}()
	select {
	case <-queued:
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	stop()
	if err := <-done; !errors.Is(err, context.Canceled) {
		t.Fatal(err)
	}
	stats, err := runtimefixture.AccountUsage(ctx, b, 18)
	if err != nil || stats["active_tasks"] != 1 || stats["waiting_tasks"] != 0 {
		t.Fatal(stats, err)
	}
}

func TestAccountConcurrencyAdoptionAndLiveChanges(t *testing.T) {
	b := runtimefixture.Redis(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	old := acquireAccount(t, b, "accepted", 18, 1)
	adopted, err := b.Adopt(ctx, "accepted", "new-owner", 18)
	if err != nil {
		t.Fatal(err)
	}
	releaseAccount(t, old)
	if err := old.Verify(ctx); err == nil {
		t.Fatal("old owner retained submission rights")
	}
	if err := adopted.Verify(ctx); err != nil {
		t.Fatal(err)
	}
	stats, err := runtimefixture.AccountUsage(ctx, b, 18)
	if err != nil || stats["active_tasks"] != 1 {
		t.Fatal(stats, err)
	}
	var limit atomic.Int32
	limit.Store(1)
	waiting := make(chan struct{}, 1)
	done := make(chan *schedule.Lease, 1)
	failed := make(chan error, 1)
	go func() {
		lease, err := b.Acquire(ctx, "next", "next", "18", []schedule.Account{{ID: 18, Limit: 1}}, func(int) { waiting <- struct{}{} }, func(context.Context) ([]schedule.Account, error) {
			return []schedule.Account{{ID: 18, Limit: int(limit.Load())}}, nil
		})
		if err != nil {
			failed <- err
		} else {
			done <- lease
		}
	}()
	select {
	case <-waiting:
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	limit.Store(2)
	select {
	case lease := <-done:
		releaseAccount(t, lease)
	case err := <-failed:
		t.Fatal(err)
	case <-ctx.Done():
		t.Fatal("updated concurrency did not take effect")
	}
	releaseAccount(t, adopted)
}

func TestAccountConcurrencyZeroAndLoweredLimit(t *testing.T) {
	b := runtimefixture.Redis(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	first := acquireAccount(t, b, "unlimited-1", 18, 0)
	second := acquireAccount(t, b, "unlimited-2", 18, 0)
	waiting := make(chan int, 1)
	done := make(chan *schedule.Lease, 1)
	failed := make(chan error, 1)
	go func() {
		lease, err := b.Acquire(ctx, "limited", "limited", "18", []schedule.Account{{ID: 18, Limit: 1}}, func(n int) { waiting <- n }, nil)
		if err != nil {
			failed <- err
		} else {
			done <- lease
		}
	}()
	select {
	case <-waiting:
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	releaseAccount(t, first)
	select {
	case <-done:
		t.Fatal("lowered limit admitted while another task remained")
	case <-time.After(250 * time.Millisecond):
	}
	releaseAccount(t, second)
	select {
	case lease := <-done:
		releaseAccount(t, lease)
	case err := <-failed:
		t.Fatal(err)
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
}

func TestAccountPoolRotationAndCapacity(t *testing.T) {
	b := runtimefixture.Redis(t)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	accounts := []schedule.Account{{ID: 18, Limit: 1}, {ID: 19, Limit: 3}}
	counts := map[uint64]int{}
	for i := 0; i < 8; i++ {
		id := fmt.Sprintf("rotate-%d", i)
		lease, err := b.Acquire(ctx, id, id, "service:1", accounts, nil, nil)
		if err != nil {
			t.Fatal(err)
		}
		counts[lease.AccountID()]++
		releaseAccount(t, lease)
	}
	if counts[18] != 4 || counts[19] != 4 {
		t.Fatalf("idle accounts did not rotate: %v", counts)
	}
	var held []*schedule.Lease
	counts = map[uint64]int{}
	for i := 0; i < 4; i++ {
		id := fmt.Sprintf("fill-%d", i)
		lease, err := b.Acquire(ctx, id, id, "service:1", accounts, nil, nil)
		if err != nil {
			t.Fatal(err)
		}
		held = append(held, lease)
		counts[lease.AccountID()]++
	}
	if counts[18] != 1 || counts[19] != 3 {
		t.Fatalf("account capacities not combined: %v", counts)
	}
	waitCtx, stop := context.WithCancel(ctx)
	queued, done := make(chan struct{}, 1), make(chan error, 1)
	go func() {
		_, err := b.Acquire(waitCtx, "blocked", "blocked", "service:1", accounts, func(int) { queued <- struct{}{} }, nil)
		done <- err
	}()
	select {
	case <-queued:
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	stop()
	if err := <-done; !errors.Is(err, context.Canceled) {
		t.Fatal(err)
	}
	for _, lease := range held {
		releaseAccount(t, lease)
	}
	if n, err := b.Client.ZCard(ctx, b.Prefix+":queue:service:1").Result(); err != nil || n != 0 {
		t.Fatal("waiter leaked", n, err)
	}
}

func TestAccountPoolSharedLimitsAcrossServices(t *testing.T) {
	b := runtimefixture.Redis(t)
	other := *b
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	accounts := []schedule.Account{{ID: 18, Limit: 2}, {ID: 19, Limit: 2}}
	var current [2]atomic.Int32
	var maximum [2]atomic.Int32
	var wg sync.WaitGroup
	failures := make(chan error, 20)
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			id := fmt.Sprintf("shared-%d", i)
			lease, err := other.Acquire(ctx, id, id, fmt.Sprintf("service:%d", i%2), accounts, nil, nil)
			if err != nil {
				failures <- err
				return
			}
			index := int(lease.AccountID() - 18)
			n := current[index].Add(1)
			for {
				old := maximum[index].Load()
				if n <= old || maximum[index].CompareAndSwap(old, n) {
					break
				}
			}
			time.Sleep(10 * time.Millisecond)
			current[index].Add(-1)
			if err := lease.Release(ctx); err != nil {
				failures <- err
			}
		}(i)
	}
	wg.Wait()
	close(failures)
	for err := range failures {
		t.Error(err)
	}
	for i := range maximum {
		if n := maximum[i].Load(); n != 2 {
			t.Fatalf("account %d actual max %d, want 2", i+18, n)
		}
	}
}

func TestAccountPoolRefreshAndOriginalTask(t *testing.T) {
	b := runtimefixture.Redis(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	accounts := []schedule.Account{{ID: 18, Limit: 1}, {ID: 19, Limit: 1}}
	first := acquireAccount(t, b, "accepted-a", 18, 1)
	second := acquireAccount(t, b, "accepted-b", 19, 1)
	var disabled atomic.Bool
	queued, done, failed := make(chan struct{}, 1), make(chan *schedule.Lease, 1), make(chan error, 1)
	go func() {
		lease, err := b.Acquire(ctx, "waiting-pool", "waiting-pool", "service:3", accounts, func(int) { queued <- struct{}{} }, func(context.Context) ([]schedule.Account, error) {
			if disabled.Load() {
				return accounts[1:], nil
			}
			return accounts, nil
		})
		if err != nil {
			failed <- err
		} else {
			done <- lease
		}
	}()
	select {
	case <-queued:
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
	disabled.Store(true)
	releaseAccount(t, first)
	select {
	case <-done:
		t.Fatal("disabled account used")
	case <-time.After(250 * time.Millisecond):
	}
	adopted, err := b.Adopt(ctx, "accepted-b", "new-owner", 19)
	if err != nil || adopted.AccountID() != 19 {
		t.Fatal("original task account lost", err)
	}
	releaseAccount(t, second)
	if err := adopted.Verify(ctx); err != nil {
		t.Fatal("old owner released new lease", err)
	}
	releaseAccount(t, adopted)
	select {
	case lease := <-done:
		if lease.AccountID() != 19 {
			t.Fatal("wrong refreshed account")
		}
		releaseAccount(t, lease)
	case err := <-failed:
		t.Fatal(err)
	case <-ctx.Done():
		t.Fatal(ctx.Err())
	}
}
