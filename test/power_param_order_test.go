package test

import (
	"context"
	"reflect"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
)

func TestPowerParamOrderAcrossSources(t *testing.T) {
	for _, testCase := range []struct {
		name  string
		sorts []int
	}{
		{name: "capability_sort_including_zero", sorts: []int{0, 10, 20}},
		{name: "equal_sort_uses_capability_id", sorts: []int{0, 0, 0}},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			repo := powerParamOrderRepository{
				params: map[uint64]botmodel.Param{
					100: {ID: 100, Key: "width", Type: "input", Status: 1},
					200: {ID: 200, Key: "height", Type: "input", Status: 1},
					300: {ID: 300, Key: "seed", Type: "input", Status: 1},
				},
				powerParams: []botmodel.PowerParam{
					{ID: 10, PowerID: 1, ParamID: 300, Sort: testCase.sorts[0]},
					{ID: 20, PowerID: 1, ParamID: 200, Sort: testCase.sorts[1]},
					{ID: 30, PowerID: 1, ParamID: 100, Sort: testCase.sorts[2]},
				},
				serviceParams: map[uint64][]botmodel.ServiceParam{
					1: {
						{ID: 201, ServiceID: 1, ParamID: 200, Key: "height_a", Sort: 10, Status: 1},
						{ID: 202, ServiceID: 1, ParamID: 100, Key: "width_a", Sort: 20, Status: 1},
						{ID: 203, ServiceID: 1, ParamID: 300, Key: "seed_a", Sort: 30, Status: 1},
					},
					2: {
						{ID: 503, ServiceID: 2, ParamID: 300, Key: "seed_b", Sort: 5, Status: 1},
						{ID: 502, ServiceID: 2, ParamID: 200, Key: "height_b", Sort: 15, Status: 1},
						{ID: 501, ServiceID: 2, ParamID: 100, Key: "width_b", Sort: 25, Status: 1},
					},
				},
			}
			for _, selection := range []struct {
				name       string
				serviceIDs []uint64
			}{
				{name: "no_source", serviceIDs: []uint64{0}},
				{name: "source_a", serviceIDs: []uint64{1}},
				{name: "source_b", serviceIDs: []uint64{2}},
				{name: "union_ab", serviceIDs: []uint64{1, 2}},
				{name: "union_ba", serviceIDs: []uint64{2, 1}},
				{name: "empty_union"},
			} {
				t.Run(selection.name, func(t *testing.T) {
					var rows []botinput.PowerParam
					if len(selection.serviceIDs) == 1 {
						rows = botinput.BuildPowerParams(context.Background(), repo, 1, selection.serviceIDs[0])
					} else {
						rows = botinput.BuildPowerParamsForServices(context.Background(), repo, 1, selection.serviceIDs)
					}
					var powerParamIDs []uint64
					var sorts []int
					for _, row := range rows {
						powerParamIDs = append(powerParamIDs, row.PowerParamID)
						sorts = append(sorts, row.Sort)
					}
					if want := []uint64{10, 20, 30}; !reflect.DeepEqual(powerParamIDs, want) {
						t.Errorf("capability parameter order = %v, want %v", powerParamIDs, want)
					}
					if !reflect.DeepEqual(sorts, testCase.sorts) {
						t.Errorf("parameter sorts = %v, want capability sorts %v", sorts, testCase.sorts)
					}
				})
			}
		})
	}
}

func TestPowerParamOrderPreservesServiceInputSlots(t *testing.T) {
	for _, independentSlots := range []bool{false, true} {
		name := "repeated_mapping"
		if independentSlots {
			name = "independent_slots"
		}
		t.Run(name, func(t *testing.T) {
			repo := powerParamOrderRepository{
				params: map[uint64]botmodel.Param{
					100: {ID: 100, Key: "image", Type: "file", ValueType: "string", Status: 1},
				},
				powerParams: []botmodel.PowerParam{
					{ID: 10, PowerID: 1, ParamID: 100, Sort: 0},
				},
				serviceParams: map[uint64][]botmodel.ServiceParam{
					1: {
						{ID: 92, ServiceID: 1, ParamID: 100, Key: "first_image", Sort: 10, Status: 1},
						{ID: 91, ServiceID: 1, ParamID: 100, Key: "second_image", Sort: 20, Status: 1},
					},
				},
			}
			wantPowerParamIDs := []uint64{10, 10}
			wantKeys := []string{"image", "image"}
			wantUnionSize := 1
			if independentSlots {
				repo.powerParams = append(repo.powerParams, botmodel.PowerParam{ID: 20, PowerID: 1, ParamID: 100, Sort: 0})
				wantPowerParamIDs = []uint64{10, 20}
				wantKeys = []string{"first_image", "second_image"}
				wantUnionSize = 2
			}
			rows := botinput.BuildPowerParams(context.Background(), repo, 1, 1)
			if len(rows) != 2 {
				t.Fatalf("service input slots = %d, want 2", len(rows))
			}
			for index, row := range rows {
				if row.PowerParamID != wantPowerParamIDs[index] || row.Key != wantKeys[index] || row.Sort != 0 {
					t.Errorf("slot %d = %#v, want capability %d, key %q, sort 0", index, row, wantPowerParamIDs[index], wantKeys[index])
				}
			}
			values := map[string]any{wantKeys[0]: "first-file", wantKeys[1]: "second-file"}
			if got := botinput.NormalizePowerParamInput(values, rows); !reflect.DeepEqual(got, values) {
				t.Errorf("normalized slots = %#v, want %#v", got, values)
			}
			union := botinput.BuildPowerParamsForServices(context.Background(), repo, 1, []uint64{1})
			if len(union) != wantUnionSize {
				t.Errorf("union parameter count = %d, want %d", len(union), wantUnionSize)
			}
		})
	}
}

type powerParamOrderRepository struct {
	params        map[uint64]botmodel.Param
	powerParams   []botmodel.PowerParam
	serviceParams map[uint64][]botmodel.ServiceParam
}

func (repo powerParamOrderRepository) ParamMap(context.Context) map[uint64]botmodel.Param {
	return repo.params
}

func (repo powerParamOrderRepository) PowerParamsByPower(context.Context, uint64) []botmodel.PowerParam {
	return repo.powerParams
}

func (repo powerParamOrderRepository) ServiceParamsByService(_ context.Context, serviceID uint64) []botmodel.ServiceParam {
	return repo.serviceParams[serviceID]
}

func (powerParamOrderRepository) ServiceEndpointsByService(context.Context, uint64) []botmodel.ServiceEndpoint {
	return nil
}

func (powerParamOrderRepository) ParamOptionsByParam(context.Context, uint64) []botmodel.ParamOption {
	return nil
}
