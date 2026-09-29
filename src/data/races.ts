import facts from './facts.json'

// His Grand Prix finishing position in every round, 2021–2024, from the film's sourced facts
// (data/facts.json in the motion-graphics project; formula1.com race-by-race results).

export type Result = { round: number; grandPrix: string; position: number | 'DNF' }
export type Year = 2021 | 2022 | 2023 | 2024

const results = facts.raceResults as unknown as Record<string, { rounds: Result[] }>

export const racesOf = (year: Year): Result[] => results[String(year)].rounds

export const describe = (r: Result) =>
  r.position === 'DNF' ? `${r.grandPrix}: did not finish` : r.position === 1 ? `${r.grandPrix}: won` : `${r.grandPrix}: P${r.position}`
