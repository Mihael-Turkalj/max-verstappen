> **Outcome (2026-09-29):** the motion project delivered one 2:51 film (`public/motion/four-in-a-row.mp4`) rather than separate clips. The site plays it as a centrepiece and rebuilds its devices as web motion (see README). This spec is kept as the record of the hand-off.

# Motion hand-off: what the website needs

The site `verstappen-four` is an unofficial fan showcase of Max Verstappen's four straight titles with Red Bull, 2021–2024. The skeleton is built: structure, verified content, and **motion slots** where the pieces play. The motion design sets the site's visual style, so send the style decisions along with the files.

## 1. The slots

| Slot id | Where | Aspect | Behaviour | Suggested length |
|---|---|---|---|---|
| `hero` | Full-bleed opening, behind the name | 16:9 (cropped to fill any screen) | Loops, muted | 8–15 s, seamless loop |
| `2021` | Chapter 1: Abu Dhabi, the last-lap decider | 16:9 | Plays once in view | 4–8 s |
| `2022` | Chapter 2: the comeback and fifteen wins | 16:9 | Plays once in view | 4–8 s |
| `2023` | Chapter 3: ten in a row, 19 of 22 | 16:9 | Plays once in view | 4–8 s |
| `2024` | Chapter 4: from 17th in São Paulo, the title in Las Vegas | 16:9 | Plays once in view | 4–8 s |
| `numbers` (optional) | The run in numbers | 21:9 | Scroll-scrubbed | any |

Not every slot needs its own piece. One long film can be cut into these segments instead; say where the cuts go.

## 2. File format

- **Master:** MP4, H.264, `yuv420p`, `+faststart`, **1920×1080**, 30 or 60 fps, **no audio track** (autoplay needs muted video).
- **Phone version** for the hero: 1080×1350 (4:5) or 1080×1920 (9:16). If there is none, keep the important action inside the centre 9:16 of the frame, because phones crop the hero.
- **Scroll-scrubbed pieces** (`numbers`, or anything else meant to follow the scroll): encode with a keyframe every 10 frames and no B-frames, for example `-g 10 -bf 0`. Otherwise seeking stutters.
- **Size:** aim for under 6 MB per clip at 1080p. The hero can be larger if it has to be.
- **Poster:** one still per clip (JPG, same size), shown before playback and for visitors with reduced motion on.
- **Names:** `hero.mp4`, `hero-poster.jpg`, `2021.mp4`, `2021-poster.jpg`, and so on. They go in `verstappen-four/public/motion/`.

## 3. Style decisions to send with the files

The site will be restyled to match the piece. Please include:

- **Colour:** the palette as hex values, marking the background, the text colour and the one accent.
- **Type:** the typeface names and weights. They must be licensed for the web (Google Fonts, Fontsource or similar). Say which face is for display and which for text.
- **Motion character:** the easing curves (cubic-bezier values or spring settings) and typical durations, so page transitions and reveals move like the film.
- **Graphic devices:** any recurring shapes, lines, numerals or textures, and how the page should echo them.
- **Stills:** 2–3 frames that sum up the look, for the design pass.

## 4. Legal

The site must not look like an official Formula 1, Red Bull or driver product.

- **No official marks:** no F1 / FORMULA 1 logos, no Red Bull or Double Bull logos, no team or sponsor logos.
- **No official media:** no broadcast footage and no official press photos.
- **Photos and likeness:** if the piece uses photos (for example from Wikimedia Commons), list each file with its author and licence so the site can credit them. If it shows the driver's likeness, say how it was made.
- **Facts:** figures shown in the film should match `research/verstappen-2021-2024.md`. For example: 10 / 15 / 19 / 9 wins; 395.5 / 454 / 575 / 437 points; margins of 8, 146, 290 and 63 points; 19 of 22 and ten in a row in 2023; 17th on the grid in São Paulo 2024.
