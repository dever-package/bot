package dbop

import "fmt"

// Insert converts Dever ORM's panic-based mutation errors into ordinary
// errors. Callers must still verify whether the error was an expected
// concurrent insert before deciding to retry or continue.
func Insert(run func() int64) (id int64, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			switch value := recovered.(type) {
			case error:
				err = value
			default:
				err = fmt.Errorf("%v", value)
			}
		}
	}()
	return run(), nil
}
