import type { BoardRow, Bracket } from '../components/Devices'

// What each chapter shows in the film's devices. Figures from data/facts.json (the film's sourced facts)
// and research/verstappen-2021-2024.md; they agree.

export type ChapterDevices = {
  carNumber: number
  bracket?: Bracket
  duel: { rival: string; rivalPoints: number; winnerPoints: number; headline: string; record?: string; mark?: { value: number; label: string } }
  board: BoardRow[]
}

export const chapterDevices: Record<number, ChapterDevices> = {
  2021: {
    carNumber: 33,
    duel: { rival: 'Hamilton', rivalPoints: 387.5, winnerPoints: 395.5, headline: '8 points between them' },
    board: [
      { text: 'Abu Dhabi Grand Prix', tone: 'ignition' },
      { text: '12 Dec 2021' },
      { text: 'Won the race' },
      { text: 'Decided on the final lap', small: true },
    ],
  },
  2022: {
    carNumber: 1,
    duel: {
      rival: 'Leclerc',
      rivalPoints: 308,
      winnerPoints: 454,
      headline: '146 points clear',
      record: '454 points in a season, beating 413',
      mark: { value: 413, label: 'Previous record 413' },
    },
    board: [
      { text: 'Japanese Grand Prix', tone: 'ignition' },
      { text: '9 Oct 2022' },
      { text: 'Won the race' },
      { text: 'With 4 races to go', small: true },
    ],
  },
  2023: {
    carNumber: 1,
    bracket: { from: 5, to: 14, label: '10 in a row · Miami → Italy' },
    duel: { rival: 'Pérez', rivalPoints: 285, winnerPoints: 575, headline: '290 points clear', record: 'Biggest title margin ever' },
    board: [
      { text: 'Qatar Grand Prix Sprint', tone: 'ignition' },
      { text: '7 Oct 2023' },
      { text: 'P2 in the sprint' },
      { text: '6 Grands Prix still to run', small: true },
    ],
  },
  2024: {
    carNumber: 1,
    bracket: { from: 11, to: 20, label: '10 races without a win', tone: 'fog' },
    duel: { rival: 'Norris', rivalPoints: 374, winnerPoints: 437, headline: '63 points clear' },
    board: [
      { text: 'Las Vegas Grand Prix', tone: 'ignition' },
      { text: '23 Nov 2024' },
      { text: 'P5' },
      { text: '2 races still to run', small: true },
    ],
  },
}
