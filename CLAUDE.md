# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static, single-page portfolio for Omar Adel Corral. Cyberpunk-editorial aesthetic, heavy custom canvas/3D math, GSAP-driven scroll choreography. No build step, no package manager, no tests.

## Run / Develop

No install. Serve the root statically:

```bash
npx servor ./ 8080
```

Or VS Code Live Server on `index.html`. Open via `http://` (not `file://`) so the Lenis/GSAP CDN scripts and module-less JS load correctly.

Deploy: drop the directory on GitHub Pages, Vercel, or Netlify. No build.

## Architecture

Three vanilla JS files, loaded sequentially in `index.html` after the GSAP + Lenis CDN scripts. No bundler, no modules — each file attaches behavior to DOM nodes already present in `index.html` and shares state via globals (`window.lenis`, GSAP timelines) rather than imports.

- `index.html` — semantic structure: hero, marquee, project cards, terminal panel, inspect drawer, preloader DOM. All canvas/terminal/drawer nodes the JS expects live here; renaming IDs/classes breaks JS without a compiler to warn you.
- `css/styles.css` (~2.9k lines) — design system in `:root` CSS variables (`--color-bg`, neon accents, `--ease-out-expo`, `--ease-elastic`). Owns the film grain overlay, ambient orbs (`mix-blend-mode: screen` + `blur(140px)`), the section-keyed `--glow-color-*` vars that `animations.js` morphs on scroll, and `cursor: none` enforcement on hover-capable devices.
- `js/particles.js` — single full-screen `<canvas id="bg-canvas">` running three sub-engines in one RAF loop: (1) 100-point constellation with cursor-radius attraction and inverse-distance line mesh, (2) cursor spark physics (friction `*= 0.96`, gravity `vy += 0.03`), (3) software-rendered 3D wireframe cube (8 verts, 12 edges, Euler rotation matrices, perspective projection — no Three.js, no WebGL) with 18 floating `0/1` glyphs sharing the same projection.
- `js/main.js` — interaction layer: dual cursor with per-element LERP factors (0.04 / 0.1 / 0.3), magnetic buttons, scramble-text decoder, 3D parallax tilt on `.project-card` (max 7°), hover-triggered terminal logger, click-triggered inspect drawer (calls `window.lenis.stop()` while open, Escape closes), and a Web Audio synth that generates click/hover tones via `AudioContext` oscillators — no audio files.
- `js/animations.js` — scroll choreography: Lenis (`duration: 1.4`, exponential easing) wired to `gsap.ticker` with `lagSmoothing(0)`; preloader sequence (counter → implosion → curtain reveal → hero cascade); marquee `timeScale` 1x–8x driven by `ScrollTrigger.getVelocity()` with `skewX` up to ±12°; per-section ambient glow morph that tweens the root `--glow-color-*` CSS vars over 2.2s.

### Cross-file coupling to know before editing

- IDs/classes referenced by JS that must stay stable: `#bg-canvas`, `.cursor-dot`, `.cursor-circle`, `.project-card`, `.magnetic`, `.film-grain`, `.ambient-orb`, the terminal panel and inspect drawer nodes, the preloader DOM (`.preloader`, counter, curtains, monogram).
- `window.lenis` is the shared scroll instance — `main.js` pauses it for the drawer; GSAP ScrollTrigger is hooked to it in `animations.js`. Don't instantiate a second Lenis.
- Project metadata (titles, descriptions, simulated server-code snippets, terminal log lines per project) is inlined as JS objects in `main.js` — adding a project means editing both `index.html` (card markup, `assets/projectN.png`) and the data object in `main.js`.
- Section-to-glow color mapping lives in `animations.js`; adding a section without registering its color triple leaves the ambient orbs frozen on the previous section.

## Conventions

- Spanish-language UI copy and README. Keep new strings in Spanish unless the user asks otherwise.
- Vanilla JS only. The README explicitly forbids Three.js/WebGL for the cube and `.mp3` files for audio — both are intentional constraints, not oversights.
- Math/physics constants (LERP factors, friction `0.96`, gravity `0.03`, cube focal distance, mesh threshold `110px`, attraction radius `160px`) are tuned by eye. Changing them visibly shifts the feel — note the old value if you alter one.

## Reference

`README.md` is the canonical technical manual (formulas, exact tunings, module responsibilities). Read it before non-trivial changes — it documents intent the code doesn't.
