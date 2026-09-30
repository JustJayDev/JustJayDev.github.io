Self-hosted web fonts
====================

space-grotesk-latin.woff2   Space Grotesk   SIL Open Font License 1.1
inter-latin.woff2           Inter           SIL Open Font License 1.1
jetbrains-mono-latin.woff2  JetBrains Mono  SIL Open Font License 1.1

All three are the upstream latin-subset variable builds, fetched from the
Google Fonts CDN and committed here so the site makes no third-party request
on first paint. They are variable fonts: one file per family covers every
weight the design uses.

The @font-face rules live in src/styles/base.css. The families are still
referenced through --font-display / --font-body / --font-mono in
src/styles/tokens.css, so nothing else needed to change.
