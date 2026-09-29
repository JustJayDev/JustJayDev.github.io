# Why v5 was weaker than ALT — and what the rebuild takes from it

Measured, not guessed. Three builds compared:

| | ALT ("Neon Cyber Terminal") | previous MAIN (indigo slate) | v5 ("Neon Ink") |
|---|---|---|---|
| body bg | `#05060f` | `#020617` | `#0a0b0d` |
| display type | Space Grotesk 84px + glow | Space Grotesk 36px | Syne 136px, no glow |
| glass/backdrop-blur elements | **12** | 2 | 0 |
| gradient surfaces | 12 | 24 | few |
| signature effects | glitch, scanlines, grid, neon borders, corner brackets, neon chips (35) | mesh hero, tilt, ripple | flat hairline cards |
| content depth | 12 pages, achievements wall, projects, socials, YouTube, terminal `cat about.txt` | 6 pages | 6 pages |
| metaphor | **one idea carried through every element** | none | none |

## What actually made ALT and the old MAIN feel stronger

1. **A metaphor carried all the way through.** ALT never draws a plain card — it draws a
   *panel* with corner brackets, a gradient border, a glass fill and a sweep highlight,
   because the whole site is a "terminal". A concept repeated at every level reads as
   design; a palette swap reads as a reskin. **v5 had no metaphor at all** — just flat
   hairline boxes. This is the single biggest reason v5 looked emptier.
2. **Real depth.** Glass fills, backdrop blur, layered fixed backdrops, glow. v5 removed
   all of it, so surfaces had nothing to catch the light.
3. **Display type with presence.** 84px with a glow against 136px flat and unlit. Bigger is
   not better; *lit* is better.
4. **Content density.** ALT ships an achievements wall, a projects page, six real socials and
   a YouTube channel. v5 cut content down to a thinner hub — it read as empty because it
   genuinely had less to show.

## Rebuild principles (v6 — "Observatory")

- Keep the terminal/telemetry *strength* (that is what felt alive) but change the world
  completely: **deep-space observatory console**, not cyberpunk street. Aurora ribbons,
  starfield, orbital rings, glass instrument panels.
- New palette, so it is not a copy of ALT: aurora green → cyan → violet on a blue-black
  void, with amber reserved for "live/warning" states.
- **One metaphor, applied everywhere:** every surface is an *instrument panel* — glass,
  hairline, corner brackets, glow, and a mono telemetry label. Cards, stats, the hub, the
  header, the footer all obey it.
- **Restore the content depth** ALT had: achievements wall, projects, real socials,
  YouTube channel, setup telemetry.
- Glow the display type. Keep reduced-motion support and a11y (single h1, marquees hidden
  from AT).

Not a reskin of v5: the metaphor, palette, surfaces, layout rhythm and content model are
all replaced. v5's stylesheet is deleted rather than overridden.
