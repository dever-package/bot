package keylock

import "sync"

type entry struct {
	mutex      sync.Mutex
	references int
}

// Locker serializes work by key while removing idle key entries.
// Its zero value is ready to use.
type Locker[K comparable] struct {
	mutex   sync.Mutex
	entries map[K]*entry
}

func (locker *Locker[K]) Lock(key K) func() {
	locker.mutex.Lock()
	if locker.entries == nil {
		locker.entries = make(map[K]*entry)
	}
	current := locker.entries[key]
	if current == nil {
		current = &entry{}
		locker.entries[key] = current
	}
	current.references++
	locker.mutex.Unlock()

	current.mutex.Lock()
	var once sync.Once
	return func() {
		once.Do(func() {
			current.mutex.Unlock()
			locker.mutex.Lock()
			current.references--
			if current.references == 0 {
				delete(locker.entries, key)
			}
			locker.mutex.Unlock()
		})
	}
}
