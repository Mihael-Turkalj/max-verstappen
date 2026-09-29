import { seasons } from './data/run'
import { Chapter } from './components/Chapter'
import { Cars, Finale, Footer, Numbers, Records } from './components/Sections'
import { Film, Hero, Hud } from './components/Top'

export default function App() {
  return (
    <>
      <Hero />
      <Hud />
      <main>
        <Film />
        {seasons.map((s, i) => (
          <Chapter key={s.year} season={s} index={i} />
        ))}
        <Numbers />
        <Records />
        <Cars />
        <Finale />
      </main>
      <Footer />
    </>
  )
}
