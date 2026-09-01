package test

import (
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestUsageStatisticsCountsUnbilledLogicalRequests(t *testing.T) {
	recordSource := readUsageSource(t, "service/energon/pricing/record.go")
	for _, contract := range []string{
		"businessKey := strings.TrimSpace(request.Billing.BusinessKey)",
		"businessKey = request.Log.RequestID",
	} {
		if !strings.Contains(recordSource, contract) {
			t.Fatalf("cost record is missing logical request key contract %q", contract)
		}
	}

	querySource := readUsageSource(t, "service/energon/usage_statistics_query.go")
	logicalRequests := usageFunctionSource(t, querySource, "usageUnchargedLogicalRequestsSQL")
	for _, contract := range []string{
		"main.power_charge_id = 0",
		"main.business_key",
		"MAX(CASE WHEN main.call_status = '%s' THEN 1 ELSE 0 END)",
		"StatusSuccess",
		"MIN(main.created_at) AS created_at",
		"MAX(main.created_at) AS last_used_at",
	} {
		if !strings.Contains(logicalRequests, contract) {
			t.Fatalf("uncharged logical request query is missing contract %q", contract)
		}
	}

	aggregate := usageFunctionSource(t, querySource, "buildUsageAggregateSQL")
	for _, contract := range []string{
		"usageUnchargedLogicalAggregateSQL(costTable, whereSQL, dimension)",
		"FROM (%s UNION ALL %s UNION ALL %s) AS usage",
		"repeatUsageFilterArgs(filterArgs, 3)",
	} {
		if !strings.Contains(aggregate, contract) {
			t.Fatalf("usage aggregate is missing uncharged call contract %q", contract)
		}
	}
}

func TestUsageDashboardCountsUnbilledLogicalRequests(t *testing.T) {
	dashboardSource := readUsageSource(t, "service/energon/usage_dashboard.go")
	trend := usageFunctionSource(t, dashboardSource, "loadUsageDashboardTrend")
	for _, contract := range []string{
		"usageUnchargedLogicalRequestsSQL(sources.CostTable, whereSQL)",
		"usageDashboardBucketExpression(",
		`"logical_request.created_at"`,
		"repeatUsageFilterArgs(filterArgs, 3)",
	} {
		if !strings.Contains(trend, contract) {
			t.Fatalf("usage trend is missing uncharged call contract %q", contract)
		}
	}

	distribution := usageFunctionSource(t, dashboardSource, "loadUsageDashboardBusinessEntryTotals")
	for _, contract := range []string{
		"usageUnchargedLogicalRequestsSQL(sources.CostTable, whereSQL)",
		"repeatUsageFilterArgs(filterArgs, 2)",
	} {
		if !strings.Contains(distribution, contract) {
			t.Fatalf("business entry distribution is missing uncharged call contract %q", contract)
		}
	}

	cacheSource := readUsageSource(t, "service/energon/usage_cache.go")
	if !strings.Contains(cacheSource, `usageStatisticsCacheVersion       = "bot:energon:usage:v3"`) {
		t.Fatal("usage cache version must change when logical-call semantics change")
	}
}

func readUsageSource(t *testing.T, relativePath string) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve bot test path")
	}
	root := filepath.Dir(filepath.Dir(filename))
	data, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func usageFunctionSource(t *testing.T, source string, name string) string {
	t.Helper()
	files := token.NewFileSet()
	parsed, err := parser.ParseFile(files, "source.go", source, 0)
	if err != nil {
		t.Fatal(err)
	}
	for _, declaration := range parsed.Decls {
		function, ok := declaration.(*ast.FuncDecl)
		if !ok || function.Name.Name != name {
			continue
		}
		start := files.Position(function.Pos()).Offset
		end := files.Position(function.End()).Offset
		return source[start:end]
	}
	t.Fatalf("function %s not found", name)
	return ""
}
