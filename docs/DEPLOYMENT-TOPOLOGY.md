# Deployment topology (resolved 2026-09-29)

## The problem we found

Two local checkouts both contained code capable of writing to the **same**
`gh-pages` branch of `JustJayDev.github.io`, each with `force_orphan: true`.
Whichever workflow finished last replaced the entire live root site.

Evidence collected before changing anything:

| Fact | Value |
|---|---|
| Live root bundle (`justjaydev.github.io/`) | `assets/index-DYOm7usv.js` |
| Same file on disk | `/root/just-jay-alt/dist/assets/index-DYOm7usv.js` |
| `JustJayDev.github.io` `gh-pages` head | `03ba615` = "deploy: e861136" |
| `JustJayDev.github.io` `main` head | `e861136` |
| `/root/just-jay-alt` HEAD | `e861136` (identical to MAIN `main`) |

So the ALT checkout was sitting on the **main** repository's commit, and had a
`mainrepo` remote pointing at `JustJayDev.github.io`. That is how the legacy
build ended up owning the live root site.

## The rule going forward

- **`gh-pages` of `JustJayDev.github.io` is owned by exactly one workflow** —
  the MAIN site's. Nothing else may write to it.
- MAIN deploys via the **official GitHub Pages Actions** (`upload-pages-artifact`
  + `deploy-pages`), not `peaceiris` force-push. This means GitHub itself
  publishes the branch, and the workflow needs no direct write to `gh-pages`.
- The legacy workflow must never target the MAIN repo. Its deploy job is
  disabled until the legacy project is retired.

## Repos

| Local path | Remote | Role |
|---|---|---|
| `/root/just-jay-site` | `JustJayDev.github.io` (origin) | **MAIN — active development** |
| `/root/just-jay-alt` | `just-jay-alt` (origin), `mainrepo` | Legacy — read-only reference, deploy disabled |

## Rollback

The legacy build is preserved at `just-jay-alt` repo `gh-pages` (`e78cdaf`) and
in `/root/just-jay-alt/dist`. If MAIN ever needs to be reverted, the previous
live site can be restored without touching the MAIN source history.
