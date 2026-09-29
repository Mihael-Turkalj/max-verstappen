// The four-title run, 2021–2024. Every figure is from research/verstappen-2021-2024.md, where each one
// carries its source. Grands Prix only for wins, poles, podiums; points include sprint and fastest-lap points.
// Poles are the credited counts (see §9 of the research for the qualifying-fastest alternative).

export type Season = {
  year: number
  title: string
  car: string
  powerUnit: string
  races: number
  wins: number
  poles: number
  podiums: number
  points: string
  runnerUp: string
  margin: number
  clinched: string
  story: string[]
  moment: { name: string; date: string; beats: string[] }
}

export const seasons: Season[] = [
  {
    year: 2021,
    title: 'Decided on the last lap',
    car: 'RB16B',
    powerUnit: 'Honda RA621H',
    races: 22,
    wins: 10,
    poles: 10,
    podiums: 18,
    points: '395.5',
    runnerUp: 'Lewis Hamilton',
    margin: 8,
    clinched: 'Abu Dhabi, the final round',
    story: [
      'A season-long fight with Lewis Hamilton, in a 2020 car carried over because of the pandemic and Honda’s last year as a works engine supplier.',
      'Ten wins and eighteen podiums, a record for a season at the time. The two arrived in Abu Dhabi level on 369.5 points.',
    ],
    moment: {
      name: 'Abu Dhabi Grand Prix',
      date: '12 December 2021',
      beats: [
        'Hamilton led from the start. A Safety Car on lap 53 let Verstappen pit for fresh soft tyres.',
        'Racing resumed for the final lap, and he passed Hamilton at Turn 5 to win by 2.256 s.',
        'The finish came from a late Safety Car restart. The FIA later said the procedure was not applied as written, but the result stands.',
      ],
    },
  },
  {
    year: 2022,
    title: 'The comeback, then the record',
    car: 'RB18',
    powerUnit: 'RBPT (Honda-built)',
    races: 22,
    wins: 15,
    poles: 7,
    podiums: 17,
    points: '454',
    runnerUp: 'Charles Leclerc',
    margin: 146,
    clinched: 'Suzuka, with 4 races left',
    story: [
      'New rules brought back ground-effect cars. After Australia he trailed Leclerc by 46 points, the largest deficit ever turned into a title.',
      'Fifteen wins and 454 points, both records for a season at the time. Red Bull took its first constructors’ title since 2013.',
    ],
    moment: {
      name: 'Japanese Grand Prix',
      date: '9 October 2022',
      beats: [
        'Rain, a red flag after two laps, and a race ended at the time limit after 28 of 53 laps.',
        'Leclerc’s last-lap penalty dropped him to third, and full points made Verstappen champion with four races to go.',
      ],
    },
  },
  {
    year: 2023,
    title: 'Nineteen of twenty-two',
    car: 'RB19',
    powerUnit: 'Honda RBPT',
    races: 22,
    wins: 19,
    poles: 12,
    podiums: 21,
    points: '575',
    runnerUp: 'Sergio Pérez',
    margin: 290,
    clinched: 'Qatar sprint, with 6 Grands Prix left',
    story: [
      'A season of records that still stand: 19 wins, a win rate of 86.36%, 575 points and 1,003 laps led.',
      'Red Bull won 21 of 22 races, beating the 15 of 16 set by McLaren in 1988. The only defeat was Singapore.',
    ],
    moment: {
      name: 'Qatar Grand Prix sprint',
      date: '7 October 2023',
      beats: [
        'He needed sixth in the 19-lap sprint and finished second, behind Oscar Piastri.',
        'The title came on a Saturday with six Grands Prix still to run, equalling Schumacher in 2002. He won the Grand Prix the next day.',
      ],
    },
  },
  {
    year: 2024,
    title: 'The one he had to fight for',
    car: 'RB20',
    powerUnit: 'Honda RBPT',
    races: 24,
    wins: 9,
    poles: 8,
    podiums: 14,
    points: '437',
    runnerUp: 'Lando Norris',
    margin: 63,
    clinched: 'Las Vegas, with 2 races left',
    story: [
      'Seven wins from the first ten races, then ten Grands Prix without one, from Austria to Mexico City.',
      'He clinched the fourth title in Las Vegas, becoming the sixth driver with four or more.',
    ],
    moment: {
      name: 'Las Vegas Grand Prix',
      date: '23 November 2024',
      beats: [
        'He only had to stay ahead of Norris. He finished fifth, Norris sixth, and George Russell won.',
        'The fourth title, with two races still to run: the sixth driver to win four or more.',
      ],
    },
  },
]

export const totals = {
  wins: seasons.reduce((n, s) => n + s.wins, 0),
  poles: seasons.reduce((n, s) => n + s.poles, 0),
  podiums: seasons.reduce((n, s) => n + s.podiums, 0),
  races: seasons.reduce((n, s) => n + s.races, 0),
  points: '1,861.5',
}

export const records: { record: string; value: string; before: string }[] = [
  { record: 'Most wins in a season', value: '19 (2023)', before: '13, Schumacher 2004 and Vettel 2013' },
  { record: 'Most consecutive wins', value: '10 (Miami to Italy, 2023)', before: '9, Vettel 2013' },
  { record: 'Highest win rate in a season', value: '86.36% (2023)', before: '75%, Ascari 1952' },
  { record: 'Most points in a season', value: '575 (2023)', before: '413, Hamilton 2019' },
  { record: 'Most podiums in a season', value: '21 (2023)', before: '17' },
  { record: 'Most laps led in a season', value: '1,003 (2023)', before: '739, Vettel 2011' },
  { record: 'Largest title-winning margin', value: '290 points (2023)', before: '' },
  { record: 'Largest deficit turned into a title', value: '46 points (2022)', before: '44, Vettel 2012' },
]

export const cars = [
  { name: 'RB16B', year: 2021, unit: 'Honda', note: 'An updated 2020 car, and Honda’s final year as a works supplier. 11 of 22 wins.' },
  { name: 'RB18', year: 2022, unit: 'RBPT, Honda-built', note: 'The first car of the ground-effect rules. 17 of 22 wins and the constructors’ title.' },
  { name: 'RB19', year: 2023, unit: 'Honda RBPT', note: 'Won 21 of 22 races, 95.45%, beating the 15 of 16 of McLaren’s MP4/4 in 1988.' },
  { name: 'RB20', year: 2024, unit: 'Honda RBPT', note: 'Won 7 of the first 10 races. The last Red Bull designed under Adrian Newey.' },
]

export const career2024 = { titles: 4, wins: 63, poles: 40, podiums: 112 }

export const afterword =
  'The run ended in 2025, by two points: Lando Norris took the title with 423 to Verstappen’s 421, after Verstappen had closed a gap of more than a hundred.'

export const sources = [
  { label: 'formula1.com: race results, 2021', href: 'https://www.formula1.com/en/results/2021/races' },
  { label: 'formula1.com: race results, 2022', href: 'https://www.formula1.com/en/results/2022/races' },
  { label: 'formula1.com: race results, 2023', href: 'https://www.formula1.com/en/results/2023/races' },
  { label: 'formula1.com: race results, 2024', href: 'https://www.formula1.com/en/results/2024/races' },
  { label: 'FIA: 2021 Abu Dhabi Grand Prix report to the World Motor Sport Council', href: 'https://www.fia.com/2021-f1-abu-dhabi-grand-prix-report-world-motor-sport-council-19-march-2022' },
  { label: 'StatsF1: Max Verstappen, season by season', href: 'https://www.statsf1.com/en/max-verstappen/saison.aspx' },
  { label: 'Wikipedia: List of Formula One driver records', href: 'https://en.wikipedia.org/wiki/List_of_Formula_One_driver_records' },
]
