import { useEffect, useState } from 'react'
import { allWork, lab } from '../data/lab'
import { racesOf, type Year } from '../data/races'
import { afterword, career2024, cars, records, seasons, sources, totals } from '../data/run'
import { formatNumber, useCountUp, useInView, usePrefersReducedMotion } from '../lib/motion'
import { CarSide, Dot, RecordTag } from './Devices'
import { Headline } from './Chapter'

/* ---------- 90 Grands Prix: every race of the run, one row per season ---------- */

export function Numbers() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!inView) return
    const t = window.setTimeout(() => setDone(true), reduced ? 0 : 90 * 18 + 300)
    return () => window.clearTimeout(t)
  }, [inView, reduced])
  const wins = useCountUp(totals.wins, done, 1100)
  const podiums = useCountUp(totals.podiums, done, 1100, 120)
  const points = useCountUp(1861.5, done, 1300, 240)
  const years: Year[] = [2021, 2022, 2023, 2024]
  const step = 142
  let i = 0

  return (
    <section className="block numbers" aria-labelledby="numbers-title">
      <h2 id="numbers-title" className="label">
        {totals.races} Grands Prix · 2021–2024
      </h2>
      <div ref={ref} className="matrix" data-in={inView}>
        {years.map((y) => {
          const races = racesOf(y)
          return (
            <div key={y} className="matrix-row">
              <span className="label matrix-year">{y}</span>
              <svg
                viewBox={`0 0 ${24 * step - 42} 100`}
                className="matrix-dots"
                role="img"
                aria-label={`${y}: ${races.filter((r) => r.position === 1).length} wins from ${races.length} Grands Prix`}
              >
                {races.map((r) => (
                  <Dot key={r.round} r={r} x={50 + (r.round - 1) * step} i={i++} />
                ))}
              </svg>
            </div>
          )
        })}
      </div>
      <dl className="totals">
        <div>
          <dt>Wins</dt>
          <dd className="tone-ignition">{wins}</dd>
        </div>
        <div>
          <dt>Podiums</dt>
          <dd>{podiums}</dd>
        </div>
        <div>
          <dt>Points</dt>
          <dd>{formatNumber(points)}</dd>
        </div>
      </dl>
      <details className="season-table-wrap">
        <summary className="label">Season by season</summary>
        <div className="table-scroll">
          <table className="season-table">
            <thead>
              <tr>
                <th scope="col">Season</th>
                <th scope="col">Car</th>
                <th scope="col">Wins</th>
                <th scope="col">Poles</th>
                <th scope="col">Podiums</th>
                <th scope="col">Points</th>
                <th scope="col">Margin</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s) => (
                <tr key={s.year}>
                  <th scope="row">{s.year}</th>
                  <td>{s.car}</td>
                  <td>
                    {s.wins}
                    <span className="of"> / {s.races}</span>
                  </td>
                  <td>{s.poles}</td>
                  <td>{s.podiums}</td>
                  <td>{s.points}</td>
                  <td>+{s.margin}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                <td />
                <td>
                  {totals.wins}
                  <span className="of"> / {totals.races}</span>
                </td>
                <td>{totals.poles}</td>
                <td>{totals.podiums}</td>
                <td>{totals.points}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </details>
      <p className="block-note">
        Grands Prix only for wins, poles and podiums; points include sprints. At the end of 2024 his career stood at {career2024.titles} titles,{' '}
        {career2024.wins} wins, {career2024.poles} poles and {career2024.podiums} podiums.
      </p>
    </section>
  )
}

/* ---------- Records that still stand ---------- */

export function Records() {
  const [ref, inView] = useInView<HTMLUListElement>()
  return (
    <section className="block" aria-labelledby="records-title">
      <Headline as="h2" lines={['Records', <span className="tone-ignition">that still stand</span>]} />
      <ul ref={ref} className="records" data-in={inView}>
        {records.map((r, i) => (
          <li key={r.record} className="record" style={{ '--i': i } as React.CSSProperties}>
            <span className="label">{r.record}</span>
            <span className="record-value">{r.value}</span>
            {r.before ? <span className="record-before">Before: {r.before}</span> : <RecordTag label="Largest ever" />}
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Four cars ---------- */

function Car({ c, i }: { c: (typeof cars)[number]; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>()
  return (
    <li ref={ref} className="car-card" data-in={inView} style={{ '--i': i } as React.CSSProperties}>
      <CarSide number={c.year === 2021 ? 33 : 1} draw={inView} />
      <p className="label">
        {c.year} · {c.unit}
      </p>
      <h3 className="car-name">{c.name}</h3>
      <p className="car-note">{c.note}</p>
    </li>
  )
}

export function Cars() {
  return (
    <section className="block" aria-labelledby="cars-title">
      <Headline as="h2" lines={['Four cars']} />
      <ul className="cars">
        {cars.map((c, i) => (
          <Car key={c.name} c={c} i={i} />
        ))}
      </ul>
    </section>
  )
}

/* ---------- Finale: four titles ---------- */

export function Finale() {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <section className="block finale" aria-labelledby="finale-title">
      <div ref={ref} className="trophies" data-in={inView} aria-hidden="true">
        {seasons.map((s, i) => (
          <span key={s.year} className="trophy" style={{ '--i': i } as React.CSSProperties}>
            <i />
            {s.year}
          </span>
        ))}
      </div>
      <Headline as="h2" lines={[<span className="tone-trophy">4× World Champion</span>]} />
      <p className="finale-note">Sixth driver in Formula 1 history to win four or more World Championships, after Fangio, Prost, Schumacher, Vettel and Hamilton.</p>
      <p className="afterword">{afterword}</p>
    </section>
  )
}

/* ---------- Footer ---------- */

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-title">Max Verstappen · 2021 · 2022 · 2023 · 2024</p>
          <p>
            An unofficial fan showcase by{' '}
            <a href="https://mihaelturkalj.com" className="link">
              Mihael Turkalj
            </a>
            . Not associated with Max Verstappen, Formula 1, the FIA, Red Bull or Honda.
          </p>
          <p>
            F1, FORMULA 1 and GRAND PRIX are trademarks of Formula One Licensing BV. Red Bull and the Double Bull device are trademarks of Red Bull GmbH.
            All other trademarks belong to their respective owners.
          </p>
          <p>The film is motion graphics made in Remotion, with the page built in its colours, type and motion. Statistics as of 29 September 2026.</p>
        </div>
        <div>
          <h2 className="label">Sources</h2>
          <ul className="footer-list">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* the rest of the lab, so one visit leads to the next */}
      <nav className="footer-lab" aria-labelledby="lab-title">
        <h2 id="lab-title" className="label">
          More from the lab
        </h2>
        <ul className="footer-lab-list">
          {lab
            .filter((l) => l.id !== 'max-verstappen')
            .map((l) => (
              <li key={l.id}>
                <a href={l.href} className="link">
                  {l.title}
                </a>
                <span>{l.what}</span>
              </li>
            ))}
        </ul>
        <a href={allWork} className="link footer-lab-all">
          All work by Mihael Turkalj →
        </a>
      </nav>
    </footer>
  )
}
