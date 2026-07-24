# Video Compose Performance Phase 3 Implementation Plan

> **For agentic workers:** Implement inline in the current bot package. The project explicitly forbids automated build and test commands; use formatting, static review, Dever audit, and user manual verification instead.

**Goal:** Reduce video composition latency without changing the existing composition document or frontend workflow.

**Architecture:** Select one of three backend strategies from normalized media metadata: full stream copy, copied video with rebuilt audio, or full transcoding. Resolve canvas asset references in one batch, reuse media probes inside one job, and limit only CPU-heavy transcoding jobs.

**Tech Stack:** Go, Dever bot Service, FFmpeg/FFprobe, existing canvas stream runtime.

---

### Task 1: Composition strategy

**Files:**
- Modify: `service/energon/processor/ffmpeg.go`
- Modify: `service/energon/processor/ffmpeg_composition.go`
- Modify: `service/energon/processor/ffmpeg_fast_concat.go`
- Create: `service/energon/processor/ffmpeg_audio_mix_concat.go`

- [x] Replace the fast-concat boolean with an internal strategy value while preserving the existing `fast_concat` result metadata.
- [x] Reuse the existing clip audio filters to build an audio-only filter graph.
- [x] Copy compatible H.264 video while rebuilding AAC audio when there are no visual transitions or burned subtitles.
- [x] Keep full transcoding as the fallback for every unsupported combination.

### Task 2: Reference and probe reuse

**Files:**
- Modify: `service/asset/query.go`
- Modify: `service/project/workspace_run.go`
- Modify: `service/project/workspace_video_compose.go`
- Modify: `service/energon/processor/ffmpeg_probe.go`
- Modify: `service/energon/processor/ffmpeg_composition.go`

- [x] Add one batch current-reference resolver that performs team-scope, asset, and version queries once.
- [x] Collect unique composition references before converting clips and reuse their resolved content.
- [x] Cache FFprobe results per local path and preload unique paths with a bounded worker count.

### Task 3: Runtime protection and observability

**Files:**
- Modify: `service/energon/processor/ffmpeg.go`
- Modify: `service/energon/processor/ffmpeg_composition.go`

- [x] Limit simultaneous full-transcode FFmpeg commands while leaving copy-based jobs outside the CPU-heavy slot.
- [x] Record composition mode plus preparation, FFmpeg, and storage durations in result metadata.
- [x] Keep cancellation and existing stream status behavior intact.

### Task 4: Static verification

**Files:**
- Review every changed file above.

- [x] Run `gofmt` on changed Go files.
- [x] Run `git diff --check`.
- [x] Run the Dever static audit on the changed bot files.
- [x] Inspect the final diff for duplicated strategy, reference, probe, and audio-filter logic.
- [x] Do not run build or test commands; leave runtime composition verification to the user.
