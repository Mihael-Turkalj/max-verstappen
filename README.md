# Verstappen: Four in a Row

An unofficial fan showcase of Max Verstappen's four straight Formula 1 world titles with Red Bull, 2021–2024. The page is built on top of a 2:51 motion-graphics film, "Four in a Row", made in Remotion. The film plays as the centrepiece, and the rest of the page rebuilds its graphic language as live web motion.

**Live site:** https://mihael-turkalj.github.io/max-verstappen/

**Status:** complete.

## How it was built

| | |
|---|---|
| **Approach** | Emil Kowalski's design-engineering skills (`emil-design-eng` for the philosophy, `animate` for every piece of motion) |
| **The film** | A Remotion project (`max-verstappen-motion-graphics`), 1920×1080, 30 fps, cut to the song. The site uses its exact design tokens and its sourced race data |
| **Content** | `research/verstappen-2021-2024.md` (76 sources) and the film's `facts.json`; they agree on every figure |
| **Stack** | Vite, React, TypeScript, plain CSS, Web Animations and CSS animations (no motion library) |
| **Impeccable hooks** | Off |

### From film to page

- **Design system:** the film's own tokens.
  - Palette: asphalt `#0C0D10`, chalk `#F2EFE9`, graphite, fog, ignition orange `#FF5A1F` for wins, trophy gold `#F2C14E` for titles only.
  - Type: Big Shoulders for numbers and headlines, JetBrains Mono for labels.
  - Motion: the film's easing curves, "snap" `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and "whip" `cubic-bezier(0.7, 0, 0.2, 1)` for wipes. Its slam spring (damping 12, stiffness 160, mass 0.7) is simulated once and turned into a CSS `linear()` easing, so the dots and slams overshoot exactly as they do in the film, off the main thread.
- **The film's devices rebuilt for the web.** Each plays once, when it comes into view.
  - Start lights: the hero's opening. Five columns light up, then lights out, and the name lands.
  - Race-dot strips: one dot per Grand Prix (win, podium, other finish, did not finish). They pop in at the film's pace, and the win and podium counters run with them.
  - Standings bars: the champion's lead is shown in orange, then comes the "points clear" line and the record stamps.
  - Pit boards for each title-deciding moment, and a chequered band between chapters that fills from the middle outwards.
  - The car in outline, drawing itself on with its race number.
  - 2023's "10 in a row" bracket, 2024's "10 races without a win" bracket, and the São Paulo grid ladder from 17th to 1st.
- **The film itself:**
  - It plays muted when it comes into view and pauses when it leaves.
  - It has a sound button and a bar split into its six acts; clicking an act jumps there.
  - "Watch 2023 in the film" (and the same for each season) scrolls to the player and plays that act with sound.
  - The HUD's four title bars fill gold as you pass each title and double as the season index.
- **Reduced motion:** every sequence shows its final state at once, and the film doesn't autoplay.

## What we learned

- **A motion-design film makes a better style source than a written brief.** Its tokens (colours, fonts, easing, spring settings) carried straight into CSS, so the page and the film feel like one piece.
- **Reuse the film's data, not just its look.** The film's `facts.json` holds his finishing position in every round, which is exactly what the dot strips needed, and it matched the site's own research.
- **Springs belong in CSS too.** A spring sampled into `linear()` gives the film's overshoot to CSS animations, with no animation library and no main-thread cost.
- **A background browser tab stops animating.** When the Playwright window lost focus it dropped to about 2 frames a second, and every animation looked broken. Check the frame rate before calling an animation bug.

## Credits and notes

- Unofficial and not associated with Max Verstappen, Formula 1, the FIA, Red Bull or Honda. F1, FORMULA 1 and GRAND PRIX are trademarks of Formula One Licensing BV. Red Bull and the Double Bull device are trademarks of Red Bull GmbH. No official logos, broadcast footage or press photos are used; the car is a generic outline with no livery.
- The film's soundtrack is used with the rights holder's permission.
- Statistics as of 29 September 2026: formula1.com results, the FIA, StatsF1 and Wikipedia (full list in the research file).

## Run it

```bash
npm install
npm run dev
```
