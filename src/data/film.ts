// The film: max-verstappen-motion-graphics/verstappen, composition FourInARow (Remotion), 1920×1080, 30 fps,
// cut to the song. Act starts come from data/beats.json there (downbeats of bars 0, 8, 24, 42, 58, 74).

export const film = {
  src: `${import.meta.env.BASE_URL}motion/four-in-a-row.mp4`,
  poster: `${import.meta.env.BASE_URL}motion/four-in-a-row-poster.jpg`,
  duration: 171.2,
}

export const acts = [
  { id: 'intro', label: 'Lights out', start: 0 },
  { id: '2021', label: '2021', start: 15.06 },
  { id: '2022', label: '2022', start: 45.06 },
  { id: '2023', label: '2023', start: 78.81 },
  { id: '2024', label: '2024', start: 108.81 },
  { id: 'finale', label: 'Four', start: 138.81 },
] as const

/** Ask the film to play from a moment (e.g. a season's act); the Film section listens. */
export const playFilmAt = (seconds: number) => window.dispatchEvent(new CustomEvent('film:play', { detail: seconds }))
