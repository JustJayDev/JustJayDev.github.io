# Security notes — v7 rebuild

## The ALT "secret area" was not carried forward

The previous ALT build shipped a route (`/secret`) whose gate ran entirely in
the browser: a SHA-256 hash plus a salt, both present in the public JS bundle,
checked against a password typed by the visitor.

That is not a secret area. Anyone can open devtools, read the salt and hash,
and brute-force offline. Worse, the payload it protected was another person's
personal data — full legal name, age, school class and hometown.

So on three separate grounds it was removed rather than reproduced:

1. **It was not secure.** Client-side hash comparison with public parameters
   provides no confidentiality.
2. **It exposed personal data of a minor.** Nothing about that belongs in a
   public bundle behind a soft gate.
3. **It invited a false promise.** A page that says "locked" and can be opened
   in five minutes teaches visitors to trust gates that do not work.

There is deliberately no replacement. No password field, no "coming soon"
teaser, no placeholder route.

## If a private area is ever wanted

The correct mechanism already exists in this ecosystem: the **Developer Vault**,
a Cloudflare Worker that is the only holder of real credentials. Its own brief
states the rule it follows:

> the browser must NEVER receive sensitive secrets

A future private area must be authenticated by that worker (a signed,
short-lived, `HttpOnly` session cookie), with authorisation enforced per
request on the server. The client may then assume it is authorised; it must
never be *given* anything it could have read on its own.

## What this site does and does not contain

- No API keys, tokens, client IDs or secrets of any kind.
- No analytics, no trackers, no third-party scripts beyond the Google Fonts
  stylesheet (fonts only; no usage ping beyond serving the font file).
- No cookies. The only client storage is `localStorage['jj-theme']` (a colour
  preference) and `sessionStorage` keys for the SPA path restore and the
  one-shot hero glitch.
- No user input is ever sent anywhere. The games search box filters
  `src/content/games.ts` in memory.

## Dependencies

Runtime dependencies are limited to React, React Router and Framer Motion.
These are bundled locally and served from the site's own origin — no CDN, no
remote script execution, no third-party origins at runtime.

## Reporting

Open an issue on the site's repository.
