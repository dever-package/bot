package readfixture

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"testing"

	"github.com/shemic/dever/orm"
)

type Query struct {
	SQL  string
	Args []driver.NamedValue
}

type Database struct {
	Rows    map[string][]map[string]driver.Value
	Queries []Query
	// BeforeQuery 可在返回行之前调整 Rows，模拟两次读取之间的状态变化。
	BeforeQuery func(Query)
	mu          sync.Mutex
}

// New 将 ORM 限定到临时配置和拒绝写入的驱动，不连接运行环境。
func New(t *testing.T) *Database {
	t.Helper()
	directory := t.TempDir()
	t.Chdir(directory)
	if err := os.MkdirAll(filepath.Join(directory, "config"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(directory, "config/setting.json"), []byte(`{"database":{"default":"default","persist":false,"create":false}}`), 0o600); err != nil {
		t.Fatal(err)
	}
	database := &Database{Rows: map[string][]map[string]driver.Value{}}
	driverName := "bot-read-fixture-" + directory
	sql.Register(driverName, sqlDriver{database})
	if _, err := orm.InitDefault(orm.Config{Driver: driverName, DSN: "unit-only"}); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = orm.CloseAll() })
	return database
}

type sqlDriver struct{ database *Database }
type connection struct{ database *Database }
type queryRows struct {
	columns []string
	values  [][]driver.Value
	index   int
}

func (d sqlDriver) Open(string) (driver.Conn, error) { return connection{d.database}, nil }
func (c connection) Close() error                    { return nil }
func (c connection) Prepare(string) (driver.Stmt, error) {
	return nil, fmt.Errorf("read fixture does not support prepared statements")
}
func (c connection) Begin() (driver.Tx, error) {
	return nil, fmt.Errorf("read fixture must not start transactions")
}
func (c connection) ExecContext(context.Context, string, []driver.NamedValue) (driver.Result, error) {
	return nil, fmt.Errorf("read fixture must not write")
}

var (
	tablePattern         = regexp.MustCompile(` FROM ([a-z_]+)`)
	runIdentityOrPattern = regexp.MustCompile(`\(\((?:main\.)?id IN \([? ,]+\)\) OR \((?:main\.)?request_id IN \([? ,]+\)\)\)`)
	predicatePattern     = regexp.MustCompile(`(?:main\.)?([a-z_]+) (= \?|IN \([? ,]+\))`)
)

func (c connection) QueryContext(_ context.Context, query string, args []driver.NamedValue) (driver.Rows, error) {
	c.database.mu.Lock()
	defer c.database.mu.Unlock()
	recorded := Query{query, append([]driver.NamedValue(nil), args...)}
	c.database.Queries = append(c.database.Queries, recorded)
	if c.database.BeforeQuery != nil {
		c.database.BeforeQuery(recorded)
	}
	plain := strings.NewReplacer("`", "", "\"", "").Replace(query)
	table := tablePattern.FindStringSubmatch(plain)
	if !strings.HasPrefix(plain, "SELECT ") || len(table) != 2 {
		return nil, fmt.Errorf("unsupported read query: %s", query)
	}
	// 只支持本轮运行身份查询的一个括号 OR 组，避免把未知逻辑当作 AND。
	if strings.Contains(plain, " OR ") && (strings.Count(plain, " OR ") != 1 || !runIdentityOrPattern.MatchString(plain)) {
		return nil, fmt.Errorf("unsupported read OR query: %s", query)
	}
	records, exists := c.database.Rows[table[1]]
	if !exists {
		return nil, fmt.Errorf("unexpected read table: %s", table[1])
	}
	projection := strings.TrimSpace(strings.SplitN(strings.TrimPrefix(plain, "SELECT "), " FROM ", 2)[0])
	countProjection := projection == "COALESCE(COUNT(*), 0)"
	columns := strings.Split(projection, ",")
	if countProjection {
		columns = []string{projection}
	} else if projection == "*" || projection == "main.*" {
		columns = nil
		if len(records) > 0 {
			for name := range records[0] {
				columns = append(columns, name)
			}
			sort.Strings(columns)
		}
	} else {
		for index, column := range columns {
			columns[index] = strings.TrimPrefix(strings.TrimSpace(column), "main.")
		}
	}
	rows := &queryRows{columns: columns}
	predicates := predicatePattern.FindAllStringSubmatchIndex(plain, -1)
	matchedArgs := 0
	for _, predicate := range predicates {
		matchedArgs += strings.Count(plain[predicate[0]:predicate[1]], "?")
	}
	if matchedArgs != len(args) {
		return nil, fmt.Errorf("fixture cannot evaluate all predicates: %s", query)
	}
	var matchedCount int64
	for _, record := range records {
		matches := true
		groupMatches := len(predicates) == 0
		for index, predicate := range predicates {
			column := plain[predicate[2]:predicate[3]]
			start := strings.Count(plain[:predicate[0]], "?")
			count := strings.Count(plain[predicate[0]:predicate[1]], "?")
			match := false
			for _, argument := range args[start : start+count] {
				if fmt.Sprint(record[column]) == fmt.Sprint(argument.Value) {
					match = true
					break
				}
			}
			if index == 0 {
				groupMatches = match
				continue
			}
			separator := plain[predicates[index-1][1]:predicate[0]]
			if strings.Contains(separator, " OR ") {
				groupMatches = groupMatches || match
			} else {
				matches = matches && groupMatches
				groupMatches = match
			}
		}
		matches = matches && groupMatches
		if !matches {
			continue
		}
		if countProjection {
			matchedCount++
			continue
		}
		values := make([]driver.Value, len(columns))
		for index, column := range columns {
			values[index] = record[column]
		}
		rows.values = append(rows.values, values)
	}
	if countProjection {
		rows.values = [][]driver.Value{{matchedCount}}
	}
	return rows, nil
}

func (r *queryRows) Columns() []string { return r.columns }
func (r *queryRows) Close() error      { return nil }
func (r *queryRows) Next(values []driver.Value) error {
	if r.index >= len(r.values) {
		return io.EOF
	}
	copy(values, r.values[r.index])
	r.index++
	return nil
}
