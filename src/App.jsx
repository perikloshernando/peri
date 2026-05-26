import Calendar from './components/Calendar'
import { getStatus } from './lib/schedule'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN — edita estas dos líneas con los datos reales
// ─────────────────────────────────────────────────────────────
// Nombre del amigo (aparece en el título).
const NOMBRE = 'Antonio'

// Fecha del PRIMER día de un turno de trabajo (día 1 de los 14 en faena).
// Mes va de 0 a 11: 0=ene, 1=feb, 2=mar, 3=abr, 4=may, 5=jun,
//                   6=jul, 7=ago, 8=sep, 9=oct, 10=nov, 11=dic
const INICIO_TURNO = new Date(2026, 5, 4)
// ─────────────────────────────────────────────────────────────

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function App() {
  const today = new Date()
  const { working, daysLeftInPhase, daysIntoPhase, nextChange } = getStatus(today, INICIO_TURNO)

  const answerText = working ? 'Sí.' : 'No.'
  const answerColor = working ? 'text-amber-300' : 'text-sky-300'
  const accentDot = working ? 'bg-amber-400' : 'bg-sky-400'
  const accentRing = working ? 'shadow-amber-500/20' : 'shadow-sky-500/20'

  const returnLabel = capitalize(
    format(nextChange, "EEEE d 'de' MMMM", { locale: es })
  )
  const dayNoun = daysLeftInPhase === 1 ? 'día' : 'días'

  // Indicador de progreso: 14 puntos para la fase actual
  const phaseLength = 14
  const dots = Array.from({ length: phaseLength }, (_, i) => i < daysIntoPhase)

  return (
    <div className="paper-bg min-h-screen flex flex-col text-slate-200">
      <main className="relative mx-auto w-full max-w-3xl px-5 md:px-6 py-12 md:py-20 flex-1">
        {/* Hero */}
        <section className="fade-up">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${accentDot} animate-pulse`} />
            Turno 14 × 14
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-slate-50">
            ¿Está {NOMBRE} de turno?{' '}
            <span className={`${answerColor} drop-shadow-[0_0_20px_rgba(251,191,36,0.25)]`}>
              {answerText}
            </span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-400">
            {working ? 'Vuelve el ' : 'Próximo turno el '}
            <span className="text-slate-200 font-medium">{returnLabel}</span>
            <span className="text-slate-500"> · en </span>
            <span className={`tabular font-medium ${answerColor}`}>
              {daysLeftInPhase} {dayNoun}
            </span>
          </p>

          {/* Indicador de progreso de la fase actual */}
          <div className="mt-6 flex items-center gap-1.5">
            {dots.map((filled, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  filled
                    ? working ? 'bg-amber-400/70' : 'bg-sky-400/70'
                    : 'bg-slate-700/60'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wider text-slate-500 tabular">
            <span>Día {daysIntoPhase + 1} de 14</span>
            <span>{working ? 'En faena' : 'En casa'}</span>
          </div>
        </section>

        {/* Calendario */}
        <section className="mt-10 md:mt-14 fade-up fade-up-2">
          <Calendar shiftStart={INICIO_TURNO} />
        </section>
      </main>
    </div>
  )
}
