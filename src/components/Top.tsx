import { useCallback, useEffect, useRef, useState } from 'react'
import { acts, film, playFilmAt } from '../data/film'
import { seasons } from '../data/run'
import { usePrefersReducedMotion } from '../lib/motion'

/* ---------- Hero: the film's cold open, lights out ---------- */

export function Hero() {
  return (
    <header className="hero" id="top">
      <svg className="hero-line" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0 992 C 900 986 1250 720 1560 420 C 1700 290 1820 232 1920 208" pathLength={1} />
      </svg>
      <div className="gantry" aria-hidden="true">
        <div className="gantry-hangers">
          <i />
          <i />
        </div>
        <div className="gantry-beam" />
        <div className="gantry-lights">
          {[0, 1, 2, 3, 4].map((c) => (
            <div key={c} className="housing" style={{ '--c': c } as React.CSSProperties}>
              <span className="lamp" />
              <span className="lamp" />
            </div>
          ))}
        </div>
      </div>
      <h1 className="hero-name">Max Verstappen</h1>
      <div className="hero-foot">
        <div className="hero-title">
          <p className="label">World Championship</p>
          <p className="hero-years">
            2021 <span className="tone-ignition">–</span> 2024
          </p>
          <p className="hero-four">
            Four seasons. <span className="tone-trophy">Four titles.</span>
          </p>
        </div>
        <button type="button" className="cta" onClick={() => playFilmAt(0)}>
          <span className="cta-play" aria-hidden="true" />
          Watch the film
          <span className="cta-meta">2:51 · sound on</span>
        </button>
      </div>
    </header>
  )
}

/* ---------- HUD: his name, the season in view, and the title counter (it fills as the titles are won) ---------- */

export function Hud() {
  const [current, setCurrent] = useState<number | null>(null)
  const [won, setWon] = useState<number[]>([])
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.year))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const clinched = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const year = Number((e.target as HTMLElement).dataset.clinch)
          setWon((w) => (w.includes(year) ? w : [...w, year]))
          clinched.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -30% 0px' },
    )
    document.querySelectorAll('[data-year]').forEach((el) => seen.observe(el))
    document.querySelectorAll('[data-clinch]').forEach((el) => clinched.observe(el))
    return () => {
      seen.disconnect()
      clinched.disconnect()
    }
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })

  return (
    <nav className="hud" aria-label="Seasons">
      <div className="hud-left">
        <a className="hud-name" href="#top">
          Max Verstappen
        </a>
        <span className="hud-season" aria-live="polite">
          {current ?? ''}
        </span>
      </div>
      <div className="hud-right">
        <button type="button" className="hud-film" onClick={() => document.querySelector('.film-stage')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })}>
          Film
        </button>
        <span className="hud-label" aria-hidden="true">
          Titles
        </span>
        <ol className="hud-titles">
          {seasons.map((s) => (
            <li key={s.year}>
              <button
                type="button"
                aria-current={current === s.year ? 'true' : undefined}
                data-won={won.includes(s.year)}
                onClick={() => go(`season-${s.year}`)}
                aria-label={`${s.year}${won.includes(s.year) ? ', title won' : ''}`}
              >
                <span className="hud-bar" />
                <span className="hud-year">{s.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

/* ---------- The film: plays muted when it comes into view; sound and acts on the bar below ---------- */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function Film() {
  const video = useRef<HTMLVideoElement>(null)
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const [full, setFull] = useState(false)
  const reduced = usePrefersReducedMotion()
  const userPaused = useRef(false)

  // progress fill per act, written straight to transforms while playing
  const paint = useCallback(() => {
    const v = video.current
    if (!v) return
    const t = v.currentTime
    acts.forEach((a, i) => {
      const end = i + 1 < acts.length ? acts[i + 1].start : film.duration
      const p = Math.min(1, Math.max(0, (t - a.start) / (end - a.start)))
      const el = fills.current[i]
      if (el) el.style.transform = `scaleX(${p})`
    })
    setTime(t)
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    let raf = 0
    const loop = () => {
      paint()
      raf = requestAnimationFrame(loop)
    }
    const onPlay = () => {
      setPlaying(true)
      setStarted(true)
      raf = requestAnimationFrame(loop)
    }
    const onPause = () => {
      setPlaying(false)
      cancelAnimationFrame(raf)
      paint()
    }
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('seeked', paint)
    v.addEventListener('ended', onPause)
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('seeked', paint)
      v.removeEventListener('ended', onPause)
    }
  }, [paint])

  // muted autoplay while the film is on screen, unless the visitor paused it or prefers reduced motion
  useEffect(() => {
    const v = video.current
    const el = section.current
    if (!v || !el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (document.fullscreenElement) return // full screen hides the page; that is not scrolling away
        if (e.intersectionRatio >= 0.6) {
          if (!reduced && !userPaused.current && v.paused && !v.ended) v.play().catch(() => {})
        } else if (e.intersectionRatio < 0.25) v.pause() // also cancels a play() still in flight
      },
      { threshold: [0, 0.25, 0.6, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // "Watch the film" and the chapters' links: play from a moment, with sound (a click allows it)
  useEffect(() => {
    const onPlayAt = (e: Event) => {
      const v = video.current
      if (!v) return
      const at = (e as CustomEvent<number>).detail
      section.current?.querySelector('.film-stage')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      v.currentTime = at
      v.muted = false
      setMuted(false)
      userPaused.current = false
      v.play().catch(() => {})
    }
    window.addEventListener('film:play', onPlayAt)
    return () => window.removeEventListener('film:play', onPlayAt)
  }, [reduced])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted && v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    }
  }

  // full screen takes the whole player (film and its bar), so sound and the acts stay in reach;
  // iPhone Safari only lets the video itself go full screen, in its own player
  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === stage.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    const el = stage.current
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {})
    } else {
      v?.webkitEnterFullscreen?.()
    }
  }

  const seek = (at: number) => {
    const v = video.current
    if (!v) return
    v.currentTime = at
    userPaused.current = false
    v.play().catch(() => {})
  }

  const act = [...acts].reverse().find((a) => time >= a.start) ?? acts[0]

  return (
    <section ref={section} className="film" id="film" aria-labelledby="film-title">
      <div ref={stage} className="film-stage" data-full={full}>
        <div className="film-head">
          <h2 id="film-title" className="label">
            The film
          </h2>
          <p className="label tone-fog">Motion graphics · 2:51</p>
        </div>
        <div className="film-frame" data-playing={playing} data-started={started}>
          <video
            ref={video}
            src={film.src}
            poster={film.poster}
            muted
            playsInline
            preload="metadata"
            onClick={toggle}
            onDoubleClick={toggleFullscreen}
            aria-label="Four in a row: a motion-graphics film of the 2021 to 2024 seasons, with music. The same numbers are told on this page."
          />
          <button type="button" className="film-big-play" onClick={toggle} aria-label="Play the film" hidden={playing}>
            <span />
          </button>
        </div>
        <div className="film-bar">
          <button type="button" className="film-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} data-state={playing ? 'pause' : 'play'}>
            <span className="icon" />
          </button>
          <ol className="film-acts">
            {acts.map((a, i) => {
              const end = i + 1 < acts.length ? acts[i + 1].start : film.duration
              return (
                <li key={a.id} style={{ flexGrow: end - a.start }}>
                  <button type="button" onClick={() => seek(a.start)} aria-current={act.id === a.id ? 'true' : undefined}>
                    <span className="film-act-track">
                      <span className="film-act-fill" ref={(el) => void (fills.current[i] = el)} />
                    </span>
                    <span className="film-act-label">{a.label}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <span className="film-now" aria-hidden="true">
            {act.label}
          </span>
          <span className="film-time" aria-hidden="true">
            {fmt(time)}
          </span>
          <button type="button" className="film-btn film-sound" onClick={toggleSound} aria-pressed={!muted}>
            {muted ? 'Sound off' : 'Sound on'}
          </button>
          <button type="button" className="film-btn film-full" onClick={toggleFullscreen} aria-label={full ? 'Exit full screen' : 'Full screen'}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {full ? (
                <path d="M6 1v5H1M10 1v5h5M6 15v-5H1M10 15v-5h5" />
              ) : (
                <path d="M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
