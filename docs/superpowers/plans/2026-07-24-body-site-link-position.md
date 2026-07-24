# Body Single-page Link Usage Plan

> Execute in the current workspace. Do not run build, type-check, tests, or create a Git commit.

## Goal

Use one single-page link record as the stable entry point for login navigation,
workbench content, login agreements, and external URLs without coupling content
articles to frontend positions.

## Data Contract

- `bot_body_link.code` is the stable unique identifier. New and edited links must
  provide a lowercase code; legacy rows may remain `NULL` until edited.
- `bot_body_link_scene` contains the fixed list scenes:
  `navigation` and `workbench_content`.
- `bot_body_link_scene_binding` stores the many-to-many relationship. Scene
  selection is optional and one link may be used by both scenes.
- `terms_of_service` and `privacy_policy` are fixed protocol codes. They do not
  require a scene.
- Link targets remain independent: either an enabled content article or an
  external/relative URL. The article form is a category -> article cascader and
  persists only `article_id`.
- The shared Page option resolver supports `childLabelField`, so the cascader
  can use category `name` and article `title` without a custom option API.
- Existing content categories and articles are unchanged.

## Backend Flow

1. The link save hook normalizes and validates code, uniqueness, scene IDs, URL,
   and article access.
2. Navigation links and fixed protocol links returned before login may only
   point to public enabled articles in enabled categories.
3. Workbench-only links may point to any enabled article in an enabled category.
4. `login/config` exposes only navigation links, legacy navigation links, and
   fixed protocol-code links. Every payload includes `code` and `scenes`.
5. `content/list` returns enabled links in the `workbench_content` scene.
   `content/detail` accepts a link ID and resolves its article after checking the
   same scene relationship.
6. `content/public` continues to accept an article ID for the public login-page
   reader.

## Frontend Flow

- Login configuration normalizes links once, derives navigation links from the
  `navigation` scene, and resolves agreements by exact code.
- Desktop navigation, mobile navigation, and agreement links share one anchor
  component and one `content_id` URL resolver.
- The workbench content menu renders article targets as internal buttons and URL
  targets as normal anchors. Article selection passes the link ID to the detail
  API.
- Site configuration no longer contains a workbench content category selector.

## Restricted Verification

- Run `gofmt` on changed Go files.
- Parse changed Page JSON with `jq empty`.
- Run the Dever static audit on changed source files.
- Run whitespace/diff checks available for the ignored package tree.
- Do not run build, type-check, or tests.
