# Agent Proactive Opening Implementation Plan

**Goal:** Allow opted-in agents to start a brand-new conversation with one server-generated assistant turn.

**Architecture:** Extend the existing chat run pipeline with an internal opening mode. The mode uses a structured `session_started` event, atomically creates only the assistant message, mounts a restricted tool set, disables billing and memory extraction, and retains the existing stream protocol. The Body chat controller eagerly materializes lazy sessions only for opted-in roles.

**Constraints:** Preserve all existing chat/document behavior, keep Agent Prompt as the only business prompt, and do not run builds or tests.

## Implementation Tasks

1. Add and expose `opening_enabled` through Agent CRUD and workbench role contracts.
2. Add an idempotent opening turn transaction and reuse the normal run orchestration.
3. Apply opening-specific tool, billing, lifecycle, and prompt policies.
4. Add the Body opening API and optional frontend runtime contract.
5. Start the opening run only for a newly materialized empty lazy session.
6. Perform static-only verification and review the final diff for behavior drift.
