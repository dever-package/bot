---
name: dever-bot
description: This skill should be used when editing the Dever bot package, including agent, energon, team flow, workspace canvas, project canvas, asset, knowledge, skill install, bot front/page JSON, bot front plugins, bot APIs, bot services, permissions, execution, streaming, and migration behavior.
version: 0.1.0
---

# Bot Package

Use this component skill together with `shemic-dever`. Read `shemic-dever` first for framework rules, then apply these bot-specific boundaries.

## Source Of Truth

- Package source: `backend/package/bot`
- Component metadata: `backend/package/bot/dever.json`
- Models: `model/agent`, `model/asset`, `model/body`, `model/energon`, `model/project`, `model/team`, `model/workspace`
- Services: `service/agent`, `service/asset`, `service/body`, `service/energon`, `service/project`, `service/team`
- APIs: `api`
- Pages: `front/page`
- Front plugin source: `front/src`

## Hard Rules

- Do not add CRUD wrapper Service/API for admin pages that package/front can handle.
- Do not edit generated `data/*` files from this package.
- Do not edit compiled front plugin output.
- Keep canvas/workspace/team execution semantics in bot services, not page JSON.
- Keep HTTP APIs thin; execution, permissions, locks, records, streaming, and external calls belong in services.
- Persist node/run/asset execution state through existing workspace/team/project service paths; do not create parallel run tables or duplicate audit tables without a clear model purpose.
- Before changing workspace or team flow behavior, inspect existing run/lock/context/record/helper services in the same package.

## Page And Front Rules

- Ordinary admin bot pages should remain page JSON.
- Custom React/plugin code is allowed for canvas/workspace/flow/editor UIs only when page JSON cannot express the interaction.
- Reuse package/front nodes/actions before adding bot-specific page services.
- Do not hardcode `/front/route/action`; use site runtime.

## Service/API Rules

- `service/agent`: agent execution and final result behavior.
- `service/energon`: provider/source/power invocation and normalization.
- `service/project`: workspace/project canvas execution, locks, records, streams, and permissions.
- `service/team`: team flow runtime, node execution, validation, approvals, and streams.

Add new service code only in the owning service directory. Avoid cross-package imports that create package/front cycles.

## Common Checks

- Permission errors: inspect bot permission service and package/front action context before loosening auth.
- Flow/canvas execution errors: inspect run state, node execution, locks, and stream watchers before changing UI.
- Option/model errors: inspect model Options/Relations and page context before hardcoding model names.
