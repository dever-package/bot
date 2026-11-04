package test

import (
	"context"
	"reflect"
	"testing"

	botinput "github.com/dever-package/bot/service/energon/input"
	"github.com/dever-package/bot/test/runtimefixture"
	frontmodel "github.com/dever-package/front/model"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
	"github.com/shemic/dever/load"
)

func TestLocalMediaReferencesUseStorageDomain(t *testing.T) {
	db := runtimefixture.New(t)
	runtimefixture.CreateTable(t, db, "upload_storage", frontmodel.UploadStorage{})
	runtimefixture.CreateTable(t, db, "upload_file", frontmodel.UploadFile{})
	load.RegisterMany(map[string]any{
		"front.NewUploadStorageModel": frontmodel.NewUploadStorageModel,
		"front.NewUploadFileModel":    frontmodel.NewUploadFileModel,
	})
	if _, err := db.Exec("INSERT INTO upload_storage (id,name,type,domain) VALUES (1,'Local','local','https://media.example.test')"); err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()
	for index, extension := range []string{"png", "mp4", "wav"} {
		id := index + 1
		objectKey := "upload/local-media." + extension
		if _, err := db.Exec("INSERT INTO upload_file (id,storage_id,path,provider_key) VALUES (?,?,?,?)", id, 1, objectKey, objectKey); err != nil {
			t.Fatal(err)
		}
		want := "https://media.example.test/" + objectKey
		file, err := uploadrepo.FindUploadFile(ctx, uint64(id))
		if err != nil {
			t.Fatal(err)
		}
		if actual := uploadrepo.ResolveUploadFileURLs(file).URL; actual != want {
			t.Fatalf("new local %s URL = %q, want %q", extension, actual, want)
		}
		for _, value := range []any{"/" + objectKey, map[string]any{"url": "/" + objectKey}, map[string]any{"id": id}} {
			if actual := botinput.FileValue(ctx, value); actual != want {
				t.Fatalf("local %s reference %v = %v, want %q", extension, value, actual, want)
			}
		}
		if actual := botinput.FileValue(ctx, []string{"/" + objectKey}); !reflect.DeepEqual(actual, []any{want}) {
			t.Fatalf("local %s list = %v", extension, actual)
		}
	}
	external := "https://cdn.example.test/image.png?token=signature&deadline=123"
	if got := botinput.FileString(ctx, external); got != external {
		t.Fatalf("external signed URL changed: %q", got)
	}
}
