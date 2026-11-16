import PomodoroTimer from '../components/PomodoroTimer'

export default function Pomodoro() {
  return (
    <section className="page">
      <h2 className="page__title">Pomodoro</h2>
      <p className="page__text">
        Concéntrate 25 minutos y luego toma un descanso de 5 minutos.
      </p>
      <PomodoroTimer />
    </section>
  )
}
