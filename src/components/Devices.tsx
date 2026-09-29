import { useEffect, useState, type ReactNode } from 'react'
import { describe, racesOf, type Result, type Year } from '../data/races'
import { formatNumber, useCountUp, useInView, usePrefersReducedMotion } from '../lib/motion'

// The film's graphic devices, rebuilt for the page. Each plays once, when it comes into view, and each
// rests in its final state for reduced motion or no JavaScript.

/* ---------- Car in outline (the film's CarSide: generic 2022+ shape, no livery or logos) ---------- */

const BODY =
  'M 985 206 C 930 196 800 168 735 156 L 652 147 L 522 139 L 506 112 L 500 84 L 468 80 ' +
  'C 418 82 330 116 252 150 L 176 168 L 150 172 L 140 238 L 900 238 L 962 222 L 985 214 Z'
const SIDEPOD = 'M 688 158 L 688 206 M 688 160 C 600 160 430 176 300 204'
const HALO = 'M 652 147 C 632 112 604 104 566 106 L 506 112'
const FRONT_WING = 'M 906 240 L 998 240 L 998 227 L 934 225 Z'
const REAR_WING = 'M 28 78 L 120 78 L 124 196 L 58 206 Z M 30 94 L 122 92 M 32 112 L 123 110'
const DETAILS = 'M 140 238 L 96 222 M 124 176 L 160 172 M 742 170 L 840 186 M 762 198 L 840 192'

export function CarSide({ number, draw, className = '' }: { number?: number; draw: boolean; className?: string }) {
  const line = { pathLength: 1, className: 'car-line' }
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy={186} r={64} {...line} className="car-line car-fill" strokeWidth={6} />
      <circle cx={cx} cy={186} r={40} {...line} strokeWidth={3} />
    </g>
  )
  return (
    <svg className={`car ${className}`} viewBox="0 0 1000 260" data-draw={draw} aria-hidden="true">
      <circle cx={570} cy={126} r={19} className="car-helmet" strokeWidth={4} />
      <path d={BODY} {...line} className="car-line car-fill" strokeWidth={5} />
      <path d={SIDEPOD} {...line} strokeWidth={3} />
      <path d={HALO} {...line} strokeWidth={4} />
      <path d={REAR_WING} {...line} className="car-line car-fill" strokeWidth={5} />
      <path d={FRONT_WING} {...line} className="car-line car-fill" strokeWidth={5} />
      <path d={DETAILS} {...line} strokeWidth={3} />
      {wheel(200)}
      {wheel(840)}
      {number !== undefined && (
        <text x={420} y={186} textAnchor="middle" className="car-number">
          {number}
        </text>
      )}
    </svg>
  )
}

/* ---------- Record stamp ---------- */

export function RecordTag({ label = 'Record', tone = 'ignition' }: { label?: string; tone?: 'ignition' | 'trophy' }) {
  return <span className={`record-tag tone-${tone}`}>{label}</span>
}

/* ---------- Chequered band between chapters: fills from the middle outwards ---------- */

export function ChequerBand() {
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -8% 0px')
  return <div ref={ref} className="chequer" data-in={inView} aria-hidden="true" />
}

/* ---------- Pit board: the moment each title was decided, one line of news per row ---------- */

export type BoardRow = { text: string; tone?: 'ignition' | 'chalk' | 'trophy'; small?: boolean }

export function PitBoard({ rows, year }: { rows: BoardRow[]; year: number }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="pitboard" data-in={inView} data-clinch={year}>
      {rows.map((r, i) => (
        <p key={r.text} className={`pitboard-row tone-${r.tone ?? 'chalk'} ${r.small ? 'is-small' : ''}`} style={{ '--i': i } as React.CSSProperties}>
          <span>{r.text}</span>
        </p>
      ))}
    </div>
  )
}

/* ---------- Season strip: one dot per Grand Prix ---------- */

const STAGGER = 55 // ms between dots, as the film pops them in

/** How many dots have popped in, counted by elapsed time, so the counters move with the dots. */
function useRevealed(count: number, run: boolean) {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduced) {
      setShown(count)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const n = Math.min(count, Math.floor((now - start) / STAGGER) + 1)
      setShown(n)
      if (n < count) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, count, reduced])
  return shown
}

export function Dot({ r, x, i, y = 50 }: { r: Result; x: number; i: number; y?: number }) {
  const style = { '--i': i } as React.CSSProperties
  let glyph: ReactNode
  if (r.position === 1) glyph = <circle cx={x} cy={y} r={50} className="dot-win" />
  else if (r.position === 'DNF')
    glyph = (
      <g className="dot-dnf">
        <line x1={x - 21} y1={y - 21} x2={x + 21} y2={y + 21} />
        <line x1={x - 21} y1={y + 21} x2={x + 21} y2={y - 21} />
      </g>
    )
  else if (r.position <= 3) glyph = <circle cx={x} cy={y} r={44} className="dot-podium" />
  else glyph = <circle cx={x} cy={y} r={15} className="dot-finish" />
  return (
    <g>
      <circle cx={x} cy={y} r={8} className="dot-slot" />
      <g className="dot" style={style}>
        <title>{describe(r)}</title>
        {glyph}
      </g>
    </g>
  )
}

export type Bracket = { from: number; to: number; label: string; tone?: 'ignition' | 'fog' }

export function SeasonStrip({ year, poles, bracket }: { year: Year; poles: number; bracket?: Bracket }) {
  const races = racesOf(year)
  const [ref, inView] = useInView<HTMLDivElement>()
  const shown = useRevealed(races.length, inView)
  const wins = races.slice(0, shown).filter((r) => r.position === 1).length
  const podiums = races.slice(0, shown).filter((r) => typeof r.position === 'number' && r.position <= 3).length
  const done = shown >= races.length
  const polesShown = useCountUp(poles, done, 700)

  const step = 142 // dot 100 + gap 42 (the film's GAP 0.42)
  const width = races.length * step - 42
  const cx = (round: number) => 50 + (round - 1) * step
  const allWins = races.filter((r) => r.position === 1).length
  const allPodiums = races.filter((r) => typeof r.position === 'number' && r.position <= 3).length
  const dnfs = races.filter((r) => r.position === 'DNF').length

  return (
    <div ref={ref} className="strip" data-in={inView} data-done={done}>
      <p className="label">{races.length} Grands Prix</p>
      <dl className="strip-stats">
        <div>
          <dt>Wins</dt>
          <dd className="tone-ignition">{wins}</dd>
        </div>
        <div>
          <dt>Podiums</dt>
          <dd>{podiums}</dd>
        </div>
        <div>
          <dt>Poles</dt>
          <dd>{polesShown}</dd>
        </div>
      </dl>
      <svg
        className="strip-dots"
        viewBox={`0 ${bracket ? -150 : 0} ${width} ${bracket ? 250 : 100}`}
        role="img"
        aria-label={`${year}: ${races.length} Grands Prix, ${allWins} wins, ${allPodiums} podiums${dnfs ? `, ${dnfs} retirements` : ''}.`}
      >
        {bracket && (
          <g className={`bracket tone-${bracket.tone ?? 'ignition'}`}>
            <path
              d={`M ${cx(bracket.from) - 50} -14 V -46 H ${cx(bracket.to) + 50} V -14`}
              pathLength={1}
              className="bracket-line"
            />
            <text x={(cx(bracket.from) + cx(bracket.to)) / 2} y={-78} textAnchor="middle" className="bracket-label">
              {bracket.label.toUpperCase()}
            </text>
          </g>
        )}
        {races.map((r, i) => (
          <Dot key={r.round} r={r} x={cx(r.round)} i={i} />
        ))}
      </svg>
      <ul className="legend" aria-hidden="true">
        <li>
          <i className="lg-win" /> Win
        </li>
        <li>
          <i className="lg-podium" /> Podium
        </li>
        <li>
          <i className="lg-finish" /> Other finish
        </li>
        <li>
          <i className="lg-dnf">×</i> Did not finish
        </li>
      </ul>
    </div>
  )
}

/* ---------- Final standings: the champion and the runner-up ---------- */

export function PointsDuel({
  winner,
  rival,
  headline,
  mark,
  record,
}: {
  winner: number
  rival: { name: string; points: number }
  headline: ReactNode
  mark?: { value: number; label: string }
  record?: string
}) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const p1 = useCountUp(winner, inView, 1300)
  const p2 = useCountUp(rival.points, inView, 1300)
  const lead = (winner - rival.points) / winner
  return (
    <div ref={ref} className="duel" data-in={inView}>
      <p className="label">Final standings</p>
      <div className="duel-rows">
        <div className="duel-row">
          <span className="pos pos-1">P1</span>
          <span className="duel-name">Verstappen</span>
          <span className="duel-track">
            <span className="duel-bar">
              <span className="duel-bar-rest" style={{ width: `${(1 - lead) * 100}%` }} />
              <span className="duel-bar-lead" style={{ width: `${lead * 100}%` }} />
            </span>
            {mark && (
              <span className="duel-mark" style={{ left: `${(mark.value / winner) * 100}%` }}>
                <span>{mark.label}</span>
              </span>
            )}
          </span>
          <span className="duel-points tone-ignition">{formatNumber(p1)}</span>
        </div>
        <div className="duel-row">
          <span className="pos">P2</span>
          <span className="duel-name">{rival.name}</span>
          <span className="duel-track">
            <span className="duel-bar" style={{ width: `${(rival.points / winner) * 100}%` }}>
              <span className="duel-bar-rest" style={{ width: '100%' }} />
            </span>
          </span>
          <span className="duel-points">{formatNumber(p2)}</span>
        </div>
      </div>
      <div className="duel-headline">
        <p className="slam tone-ignition">{headline}</p>
        {record && (
          <p className="duel-record">
            <RecordTag /> {record}
          </p>
        )}
      </div>
    </div>
  )
}

/* ---------- 2024, São Paulo: from 17th on the grid to the win ---------- */

export function GridClimb() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const rows = Array.from({ length: 17 }, (_, i) => i + 1)
  return (
    <div ref={ref} className="climb" data-in={inView}>
      <div className="climb-copy">
        <p className="label">São Paulo Grand Prix · 3 Nov 2024</p>
        <p className="climb-from">From 17th</p>
        <p className="climb-to tone-ignition">to 1st</p>
        <p className="climb-note">An engine penalty put him 17th on the grid for a wet race. He led from the lap-43 restart and won by 19.477 s.</p>
      </div>
      <div className="climb-ladder" aria-hidden="true">
        <ol>
          {rows.map((p) => (
            <li key={p} className={p === 1 ? 'is-first' : p === 17 ? 'is-start' : ''}>
              P{p}
            </li>
          ))}
        </ol>
        <span className="climb-car" />
      </div>
    </div>
  )
}

/* ---------- Slam stat: a big number with its label and an optional record stamp ---------- */

export function SlamStat({ value, label, sub, record, decimals = false }: { value: number; label: string; sub?: string; record?: boolean; decimals?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const n = useCountUp(value, inView, 1100)
  return (
    <div ref={ref} className="slam-stat" data-in={inView}>
      <span className="slam-stat-value">{decimals ? formatNumber(n) : n.toLocaleString('en-GB')}</span>
      <span className="slam-stat-label">
        {label}
        {sub && <small>{sub}</small>}
        {record && <RecordTag />}
      </span>
    </div>
  )
}
