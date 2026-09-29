import type { ReactNode } from 'react'
import { chapterDevices } from '../data/chapters'
import { acts, playFilmAt } from '../data/film'
import type { Year } from '../data/races'
import type { Season } from '../data/run'
import { useInView } from '../lib/motion'
import { CarSide, ChequerBand, GridClimb, PitBoard, PointsDuel, SeasonStrip, SlamStat } from './Devices'

/** A headline set line by line, each line rising out of a mask, as the film's text does. */
export function Headline({ lines, caption, as: Tag = 'p' }: { lines: ReactNode[]; caption?: string; as?: 'p' | 'h2' | 'h3' }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="headline" data-in={inView}>
      <Tag className="headline-text">
        {lines.map((l, i) => (
          <span key={i} className="headline-line" style={{ '--i': i } as React.CSSProperties}>
            <span>{l}</span>
          </span>
        ))}
      </Tag>
      {caption && <p className="label headline-caption">{caption}</p>}
    </div>
  )
}

function Extras({ year }: { year: number }) {
  if (year === 2021)
    return (
      <div className="extras extras-2021">
        <Headline
          lines={['Decided', 'on the final lap', 'of the final race', <span className="tone-ignition">of the season</span>]}
          caption="Abu Dhabi Grand Prix · 12 Dec 2021"
        />
        <Headline lines={['First Formula 1', 'World Champion', <span className="tone-ignition">from the Netherlands</span>]} />
      </div>
    )
  if (year === 2022)
    return (
      <div className="extras">
        <SlamStat value={15} label="Wins" sub="Previous record 13" record />
      </div>
    )
  if (year === 2023)
    return (
      <div className="extras extras-grid">
        <SlamStat value={19} label="Wins" sub="Of 22 races" record />
        <SlamStat value={21} label="Podiums" sub="Of 22 races" record />
        <SlamStat value={575} label="Points" sub="Of 620 possible" record />
        <SlamStat value={1003} label="Laps led" sub="Of 1,325 laps" record />
      </div>
    )
  if (year === 2024)
    return (
      <div className="extras">
        <GridClimb />
      </div>
    )
  return null
}

export function Chapter({ season, index }: { season: Season; index: number }) {
  const d = chapterDevices[season.year]
  const [ref, inView] = useInView<HTMLDivElement>()
  const act = acts.find((a) => a.id === String(season.year))!
  const s = season
  return (
    <section className="chapter" id={`season-${s.year}`} data-year={s.year} aria-labelledby={`title-${s.year}`}>
      <div ref={ref} className={`year-card ${s.year === 2024 ? 'is-outline' : ''}`} data-in={inView}>
        <p className="year-num" aria-hidden="true">
          {s.year}
        </p>
        <CarSide number={d.carNumber} draw={inView} className="year-car" />
        <p className="label year-meta">
          <span className="tone-ignition">Title 0{index + 1}</span> Car {d.carNumber}
        </p>
        <h2 id={`title-${s.year}`} className="chapter-title">
          <span className="visually-hidden">{s.year}: </span>
          {s.title}
        </h2>
      </div>

      <div className="chapter-grid">
        <div className="chapter-story">
          {s.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="chapter-clinch">
            <span className="label">Title clinched</span> {s.clinched}
          </p>
          <button type="button" className="watch" onClick={() => playFilmAt(act.start)}>
            <span className="cta-play" aria-hidden="true" /> Watch {s.year} in the film
          </button>
        </div>
        <SeasonStrip year={s.year as Year} poles={s.poles} bracket={d.bracket} />
      </div>

      <Extras year={s.year} />

      <PointsDuel
        winner={d.duel.winnerPoints}
        rival={{ name: d.duel.rival, points: d.duel.rivalPoints }}
        headline={d.duel.headline}
        record={d.duel.record}
        mark={d.duel.mark}
      />

      <div className="moment">
        <PitBoard rows={d.board} year={s.year} />
        <div className="moment-copy">
          <p className="label">{s.moment.date}</p>
          <h3 className="moment-name">{s.moment.name}</h3>
          <ol className="moment-beats">
            {s.moment.beats.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ol>
        </div>
      </div>

      <ChequerBand />
    </section>
  )
}
