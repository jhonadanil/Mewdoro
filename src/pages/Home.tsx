import type { Page } from '../types'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <section className="page">
      <h2 className="page__title">Bienvenido</h2>
      <p className="page__text">
        Organiza tus ideas y mantén la concentración con el temporizador Pomodoro.
      </p>

      <div className="home__cards">
        <button type="button" className="home__card" onClick={() => onNavigate('notes')}>
          <span className="home__card-icon">🗒️</span>
          <span className="home__card-title">Notas</span>
          <span className="home__card-text">Crea y administra tus notas.</span>
        </button>

        <button type="button" className="home__card" onClick={() => onNavigate('pomodoro')}>
          <span className="home__card-icon">⏱️</span>
          <span className="home__card-title">Pomodoro</span>
          <span className="home__card-text">Trabaja en bloques de 25 minutos.</span>
        </button>
      </div>
    </section>
  )
}
