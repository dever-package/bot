package energon

import (
	"context"
	"strings"

	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

type imageSequenceExactSet struct {
	identities    map[string]struct{}
	contentHashes map[string]struct{}
}

func newImageSequenceExactSet() *imageSequenceExactSet {
	return &imageSequenceExactSet{
		identities:    map[string]struct{}{},
		contentHashes: map[string]struct{}{},
	}
}

func (images *imageSequenceExactSet) accept(ctx context.Context, imageURL string) (bool, error) {
	if err := ctx.Err(); err != nil {
		return false, err
	}
	if images == nil {
		return true, nil
	}
	imageURL = strings.TrimSpace(imageURL)
	if images.containsExact(imageURL, "") {
		return false, nil
	}
	contentHash := ""
	if file, found := uploadrepo.FindUploadFileByReference(ctx, imageURL); found {
		contentHash = strings.ToLower(strings.TrimSpace(file.Hash))
	}
	if images.containsExact(imageURL, contentHash) {
		return false, nil
	}
	if imageURL != "" {
		images.identities[imageURL] = struct{}{}
	}
	if contentHash != "" {
		images.contentHashes[contentHash] = struct{}{}
	}
	return true, nil
}

func (images *imageSequenceExactSet) containsExact(imageURL string, contentHash string) bool {
	if images == nil {
		return false
	}
	_, hasIdentity := images.identities[imageURL]
	_, hasContentHash := images.contentHashes[contentHash]
	return (imageURL != "" && hasIdentity) || (contentHash != "" && hasContentHash)
}
