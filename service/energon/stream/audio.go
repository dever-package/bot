package stream

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"net/url"
	"strings"
	"sync"
	"time"
)

const (
	audioStreamPath             = "/bot/speech/audio"
	defaultAudioStreamMIME      = "audio/mpeg"
	defaultAudioStreamMaxBytes  = 64 << 20
	defaultAudioStreamTTL       = 15 * time.Minute
	defaultAudioSubscriberQueue = 64
)

type AudioDescriptor struct {
	URL  string
	MIME string
}

type AudioSubscription struct {
	MIME    string
	Initial [][]byte
	Done    bool
	Err     error
	events  <-chan []byte
	close   func()
}

func (subscription *AudioSubscription) Events() <-chan []byte {
	if subscription == nil {
		return nil
	}
	return subscription.events
}

func (subscription *AudioSubscription) Close() {
	if subscription == nil || subscription.close == nil {
		return
	}
	subscription.close()
	subscription.close = nil
}

type AudioRelay struct {
	mu        sync.Mutex
	sessions  map[string]*audioSession
	committed map[string]time.Time
	maxBytes  int
	ttl       time.Duration
	queueSize int
}

type audioSession struct {
	token       string
	mime        string
	chunks      [][]byte
	totalBytes  int
	committed   bool
	done        bool
	err         error
	expiresAt   time.Time
	subscribers map[*audioSubscriber]struct{}
}

type audioSubscriber struct {
	chunks chan []byte
	closed bool
}

var sharedAudioRelay = NewAudioRelay(
	defaultAudioStreamMaxBytes,
	defaultAudioStreamTTL,
	defaultAudioSubscriberQueue,
)

func SharedAudioRelay() *AudioRelay {
	return sharedAudioRelay
}

func NewAudioRelay(maxBytes int, ttl time.Duration, queueSize int) *AudioRelay {
	if maxBytes <= 0 {
		maxBytes = defaultAudioStreamMaxBytes
	}
	if ttl <= 0 {
		ttl = defaultAudioStreamTTL
	}
	if queueSize <= 0 {
		queueSize = defaultAudioSubscriberQueue
	}
	return &AudioRelay{
		sessions:  map[string]*audioSession{},
		committed: map[string]time.Time{},
		maxBytes:  maxBytes,
		ttl:       ttl,
		queueSize: queueSize,
	}
}

func (relay *AudioRelay) Start(requestID string, mimeType string) (AudioDescriptor, error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return AudioDescriptor{}, fmt.Errorf("音频流 request_id 不能为空")
	}
	mimeType = normalizeAudioStreamMIME(mimeType)
	relay.mu.Lock()
	relay.cleanupExpiredLocked(time.Now())
	if current := relay.sessions[requestID]; current != nil && !current.done {
		descriptor := audioDescriptor(requestID, current)
		relay.mu.Unlock()
		return descriptor, nil
	}
	relay.mu.Unlock()

	token, err := newAudioStreamToken()
	if err != nil {
		return AudioDescriptor{}, err
	}

	relay.mu.Lock()
	defer relay.mu.Unlock()
	relay.cleanupExpiredLocked(time.Now())
	if current := relay.sessions[requestID]; current != nil && !current.done {
		return audioDescriptor(requestID, current), nil
	}
	session := &audioSession{
		token:       token,
		mime:        mimeType,
		expiresAt:   time.Now().Add(relay.ttl),
		subscribers: map[*audioSubscriber]struct{}{},
	}
	if _, exists := relay.committed[requestID]; exists {
		session.committed = true
	}
	delete(relay.committed, requestID)
	relay.sessions[requestID] = session
	time.AfterFunc(relay.ttl, func() {
		relay.expire(requestID, token)
	})
	return audioDescriptor(requestID, session), nil
}

func (relay *AudioRelay) Publish(requestID string, content []byte) error {
	if len(content) == 0 {
		return nil
	}
	requestID = strings.TrimSpace(requestID)
	relay.mu.Lock()
	defer relay.mu.Unlock()
	session := relay.sessions[requestID]
	if session == nil {
		return fmt.Errorf("音频流会话不存在")
	}
	if session.done {
		return fmt.Errorf("音频流会话已结束")
	}
	session.committed = true
	if session.totalBytes+len(content) > relay.maxBytes {
		err := fmt.Errorf("音频流超过单次大小限制")
		relay.finishLocked(session, err)
		return err
	}

	chunk := append([]byte(nil), content...)
	session.chunks = append(session.chunks, chunk)
	session.totalBytes += len(chunk)
	session.expiresAt = time.Now().Add(relay.ttl)
	for subscriber := range session.subscribers {
		select {
		case subscriber.chunks <- chunk:
		default:
			relay.removeSubscriberLocked(session, subscriber)
		}
	}
	return nil
}

func (relay *AudioRelay) Complete(requestID string) {
	relay.finish(requestID, nil)
}

func (relay *AudioRelay) Commit(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}
	relay.mu.Lock()
	defer relay.mu.Unlock()
	if session := relay.sessions[requestID]; session != nil {
		session.committed = true
		session.expiresAt = time.Now().Add(relay.ttl)
		return
	}
	relay.committed[requestID] = time.Now().Add(relay.ttl)
	time.AfterFunc(relay.ttl, func() {
		relay.expireCommitment(requestID)
	})
}

func (relay *AudioRelay) Fail(requestID string, err error) {
	if err == nil {
		return
	}
	relay.finish(requestID, err)
}

func (relay *AudioRelay) finish(requestID string, err error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}
	relay.mu.Lock()
	defer relay.mu.Unlock()
	if session := relay.sessions[requestID]; session != nil {
		relay.finishLocked(session, err)
	}
}

func (relay *AudioRelay) Committed(requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	relay.mu.Lock()
	defer relay.mu.Unlock()
	relay.cleanupExpiredLocked(time.Now())
	session := relay.sessions[requestID]
	if session != nil && session.committed {
		return true
	}
	_, exists := relay.committed[requestID]
	return exists
}

func (relay *AudioRelay) Subscribe(requestID string, token string) (*AudioSubscription, error) {
	requestID = strings.TrimSpace(requestID)
	token = strings.TrimSpace(token)
	relay.mu.Lock()
	defer relay.mu.Unlock()
	relay.cleanupExpiredLocked(time.Now())
	session := relay.sessions[requestID]
	if session == nil || !sameAudioStreamToken(session.token, token) {
		return nil, fmt.Errorf("音频流不存在或已过期")
	}

	initial := make([][]byte, 0, len(session.chunks))
	for _, chunk := range session.chunks {
		initial = append(initial, append([]byte(nil), chunk...))
	}
	subscription := &AudioSubscription{
		MIME:    session.mime,
		Initial: initial,
		Done:    session.done,
		Err:     session.err,
	}
	if session.done {
		return subscription, nil
	}

	subscriber := &audioSubscriber{chunks: make(chan []byte, relay.queueSize)}
	session.subscribers[subscriber] = struct{}{}
	subscription.events = subscriber.chunks
	subscription.close = func() {
		relay.mu.Lock()
		defer relay.mu.Unlock()
		if current := relay.sessions[requestID]; current != nil {
			relay.removeSubscriberLocked(current, subscriber)
		}
	}
	return subscription, nil
}

func (relay *AudioRelay) finishLocked(session *audioSession, err error) {
	if session.done {
		return
	}
	session.done = true
	session.err = err
	session.expiresAt = time.Now().Add(relay.ttl)
	for subscriber := range session.subscribers {
		relay.removeSubscriberLocked(session, subscriber)
	}
}

func (relay *AudioRelay) removeSubscriberLocked(session *audioSession, subscriber *audioSubscriber) {
	if subscriber == nil || subscriber.closed {
		return
	}
	delete(session.subscribers, subscriber)
	subscriber.closed = true
	close(subscriber.chunks)
}

func (relay *AudioRelay) cleanupExpiredLocked(now time.Time) {
	for requestID, expiresAt := range relay.committed {
		if !now.Before(expiresAt) {
			delete(relay.committed, requestID)
		}
	}
	for requestID, session := range relay.sessions {
		if session == nil {
			delete(relay.sessions, requestID)
			continue
		}
		if now.Before(session.expiresAt) {
			continue
		}
		for subscriber := range session.subscribers {
			relay.removeSubscriberLocked(session, subscriber)
		}
		delete(relay.sessions, requestID)
	}
}

func (relay *AudioRelay) expireCommitment(requestID string) {
	relay.mu.Lock()
	defer relay.mu.Unlock()
	expiresAt, exists := relay.committed[requestID]
	if !exists {
		return
	}
	if delay := time.Until(expiresAt); delay > 0 {
		time.AfterFunc(delay, func() {
			relay.expireCommitment(requestID)
		})
		return
	}
	delete(relay.committed, requestID)
}

func (relay *AudioRelay) expire(requestID string, token string) {
	relay.mu.Lock()
	session := relay.sessions[requestID]
	if session == nil || !sameAudioStreamToken(session.token, token) {
		relay.mu.Unlock()
		return
	}
	if delay := time.Until(session.expiresAt); delay > 0 {
		relay.mu.Unlock()
		time.AfterFunc(delay, func() {
			relay.expire(requestID, token)
		})
		return
	}
	for subscriber := range session.subscribers {
		relay.removeSubscriberLocked(session, subscriber)
	}
	delete(relay.sessions, requestID)
	relay.mu.Unlock()
}

func audioDescriptor(requestID string, session *audioSession) AudioDescriptor {
	query := url.Values{}
	query.Set("request_id", requestID)
	query.Set("token", session.token)
	return AudioDescriptor{
		URL:  audioStreamPath + "?" + query.Encode(),
		MIME: session.mime,
	}
}

func newAudioStreamToken() (string, error) {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return "", fmt.Errorf("创建音频流令牌失败: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(raw), nil
}

func sameAudioStreamToken(expected string, current string) bool {
	if expected == "" || current == "" || len(expected) != len(current) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(expected), []byte(current)) == 1
}

func normalizeAudioStreamMIME(value string) string {
	value = strings.TrimSpace(strings.Split(value, ";")[0])
	if strings.HasPrefix(strings.ToLower(value), "audio/") {
		return value
	}
	return defaultAudioStreamMIME
}
