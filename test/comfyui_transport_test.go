package test

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	botprovider "github.com/dever-package/bot/service/energon/provider"
)

func TestComfyUITransportJSONMultipartBinary(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch request.URL.Path {
		case "/json":
			if request.Header.Get("Content-Type") != "application/json" {
				t.Error("JSON content type changed")
			}
			var body map[string]any
			json.NewDecoder(request.Body).Decode(&body)
			writer.Header().Set("Content-Type", "application/json")
			json.NewEncoder(writer).Encode(body)
		case "/multipart":
			file, header, err := request.FormFile("image")
			if err != nil {
				t.Error(err)
				return
			}
			defer file.Close()
			defer request.MultipartForm.RemoveAll()
			content, _ := io.ReadAll(file)
			if header.Filename != `test"file.png` || header.Header.Get("Content-Type") != "image/png" || string(content) != "content" || request.FormValue("type") != "input" {
				t.Error("multipart content or metadata changed")
			}
			io.WriteString(writer, `{"name":"test.png"}`)
		case "/binary":
			writer.Header().Set("Content-Type", "image/png")
			writer.Write([]byte{0, 255, 1, 254})
		case "/error":
			writer.Header().Set("Content-Type", "application/json")
			writer.WriteHeader(http.StatusUnauthorized)
			io.WriteString(writer, `{"error":"unauthorized"}`)
		}
	}))
	defer server.Close()
	client := botprovider.NewHTTPClient(time.Second)
	response, err := client.Do(context.Background(), botprovider.Request{URL: server.URL + "/json", Method: http.MethodPost, Body: map[string]any{"seed": 3}})
	if err != nil || response.Body.(map[string]any)["seed"] != float64(3) {
		t.Fatalf("JSON compatibility: %v", err)
	}
	form := &botprovider.MultipartForm{Fields: map[string]string{"type": "input"}, Files: []botprovider.MultipartFile{{Field: "image", Filename: `test"file.png`, MIME: "image/png", Content: []byte("content")}}}
	_, err = client.Do(context.Background(), botprovider.Request{URL: server.URL + "/multipart", Method: http.MethodPost, Headers: map[string]string{"Content-Type": "application/json"}, Multipart: form})
	if err != nil {
		t.Fatal(err)
	}
	if _, err = client.Do(context.Background(), botprovider.Request{URL: server.URL + "/multipart", Method: http.MethodPost, Body: map[string]any{}, Multipart: form}); err == nil {
		t.Fatal("ambiguous request body accepted")
	}
	response, err = client.Do(context.Background(), botprovider.Request{URL: server.URL + "/binary", Method: http.MethodGet, BinaryResponse: true})
	if err != nil {
		t.Fatal(err)
	}
	payload, valid := botprovider.AsBinaryPayload(response.Body)
	if !valid || payload.MIME != "image/png" || !bytes.Equal(payload.Content, []byte{0, 255, 1, 254}) {
		t.Fatal("binary content changed")
	}
	response, err = client.Do(context.Background(), botprovider.Request{URL: server.URL + "/error", Method: http.MethodGet, BinaryResponse: true})
	if err != nil || response.StatusCode != http.StatusUnauthorized || response.Body.(map[string]any)["error"] != "unauthorized" {
		t.Fatalf("error response was not preserved: %v", err)
	}
}

func TestComfyUITransportRedirectBoundaries(t *testing.T) {
	var crossOriginHits atomic.Int32
	other := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		crossOriginHits.Add(1)
		io.WriteString(writer, "ok")
	}))
	defer other.Close()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch request.URL.Path {
		case "/cross":
			http.Redirect(writer, request, other.URL, http.StatusFound)
		case "/same":
			http.Redirect(writer, request, "/ok", http.StatusFound)
		case "/ok":
			if request.Header.Get("Authorization") != "Basic dXNlcjpwdw==" {
				t.Error("same-origin authentication was lost")
			}
			io.WriteString(writer, "ok")
		}
	}))
	defer server.Close()
	client := botprovider.NewHTTPClient(time.Second)
	request := botprovider.Request{URL: server.URL + "/cross", Method: http.MethodGet, Headers: map[string]string{"Authorization": "Basic dXNlcjpwdw=="}, SameOriginRedirects: true}
	if _, err := client.Do(context.Background(), request); err == nil || crossOriginHits.Load() != 0 {
		t.Fatal("credential-bearing cross-origin redirect followed")
	}
	request.URL = server.URL + "/same"
	if _, err := client.Do(context.Background(), request); err != nil {
		t.Fatal(err)
	}
	request.URL, request.SameOriginRedirects = server.URL+"/cross", false
	if _, err := client.Do(context.Background(), request); err != nil || crossOriginHits.Load() != 1 {
		t.Fatal("ordinary redirect behavior changed")
	}
}
