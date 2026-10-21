// Package runtimefixture provides isolated SQL fixtures; it never reads service configuration.
package runtimefixture

import (
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"strings"
	"testing"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/shemic/dever/orm"
)

func New(t *testing.T) *sqlx.DB {
	t.Helper()
	directory := t.TempDir()
	t.Chdir(directory)
	if err := os.MkdirAll("config", 0700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile("config/setting.json", []byte(`{"database":{"default":"default","persist":false,"create":false}}`), 0600); err != nil {
		t.Fatal(err)
	}
	db, err := orm.InitDefault(orm.Config{Driver: "sqlite3", DSN: filepath.Join(directory, "runtime.db")})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = orm.CloseAll() })
	return db
}
func CreateTable(t *testing.T, db *sqlx.DB, table string, model any) {
	t.Helper()

	snakeA := regexp.MustCompile(`([A-Z]+)([A-Z][a-z])`)
	snakeB := regexp.MustCompile(`([a-z0-9])([A-Z])`)

	typ := reflect.TypeOf(model)
	columns := []string{}
	for i := 0; i < typ.NumField(); i++ {
		field := typ.Field(i)
		name := strings.ToLower(snakeB.ReplaceAllString(snakeA.ReplaceAllString(field.Name, "${1}_${2}"), "${1}_${2}"))
		sqlType := "TEXT DEFAULT ''"
		ftype := field.Type
		if ftype.Kind() == reflect.Pointer {
			ftype = ftype.Elem()
		}
		if ftype == reflect.TypeOf(time.Time{}) {
			sqlType = "DATETIME"
		} else if ftype.Kind() >= reflect.Int && ftype.Kind() <= reflect.Uint64 {
			sqlType = "INTEGER DEFAULT 0"
		}
		if name == "id" {
			sqlType = "INTEGER PRIMARY KEY"
		}
		columns = append(columns, name+" "+sqlType)
	}
	if _, err := db.Exec("CREATE TABLE " + table + " (" + strings.Join(columns, ",") + ")"); err != nil {
		t.Fatal(err)
	}
}
