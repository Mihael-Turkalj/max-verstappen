import { useEffect, useRef, useState } from 'react'

// The film's motion tokens (max-verstappen-motion-graphics/verstappen/src/theme/motion.ts), carried to the web
// so the page moves like the film.
export const ease = {
  snap: 'cubic-bezier(0.16, 1, 0.3, 1)', // fast in, soft settle: entrances
  whip: 'cubic-bezier(0.7, 0, 0.2, 1)', // wipes and transitions
} as const

/**
 * A spring as a CSS linear() easing, so a CSS animation can carry it off the main thread.
 * Simulates x'' = (-k(x - 1) - c x') / m from rest at 0, and samples it until it settles.
 */
function springEasing(stiffness: number, damping: number, mass: number) {
  const dt = 1 / 240
  const points: number[] = []
  let x = 0
  let v = 0
  let t = 0
  for (; t < 3; t += dt) {
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
    points.push(x)
    if (t > 0.1 && Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break
  }
  const step = Math.max(1, Math.round(points.length / 48))
  const sampled = points.filter((_, i) => i % step === 0)
  sampled.push(1)
  return { css: `linear(0, ${sampled.map((p) => p.toFixed(4)).join(', ')})`, ms: Math.round(t * 1000) }
}

// punch: the film's slam spring (damping 12, stiffness 160, mass 0.7), about 11% overshoot
export const punch = springEasing(160, 12, 0.7)

export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** True once the element has come into view (it stays true: each sequence plays once). */
export function useInView<T extends Element>(margin = '0px 0px -18% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView] as const
}

const snapFn = (t: number) => {
  // cubic-bezier(0.16, 1, 0.3, 1) solved for y at x = t (Newton on x)
  let u = t
  for (let i = 0; i < 6; i++) {
    const x = 3 * (1 - u) * (1 - u) * u * 0.16 + 3 * (1 - u) * u * u * 0.3 + u * u * u - t
    const dx = 3 * (1 - u) * (1 - u) * 0.16 + 6 * (1 - u) * u * (0.3 - 0.16) + 3 * u * u * (1 - 0.3)
    if (Math.abs(dx) < 1e-6) break
    u -= x / dx
  }
  u = Math.min(1, Math.max(0, u))
  return 3 * (1 - u) * (1 - u) * u + 3 * (1 - u) * u * u + u * u * u
}

/**
 * Counts from 0 to target once `run` turns true, on the film's snap curve: whole numbers on the way,
 * the exact value (e.g. 395.5) once it lands, as the film's countUp does.
 */
export function useCountUp(target: number, run: boolean, ms = 1200, delay = 0) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduced) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / ms))
      setValue(p >= 1 ? target : Math.floor(target * snapFn(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms, delay, reduced])
  return value
}

export const formatNumber = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 1 })
