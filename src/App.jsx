import Calendar from './components/Calendar'
import { getStatus } from './lib/schedule'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN — edita estas dos líneas con los datos reales
// ─────────────────────────────────────────────────────────────
const NOMBRE = 'Antonio'
const INICIO_TURNO = new Date(2026, 5, 4)
// ─────────────────────────────────────────────────────────────

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function App() {
  const today = new Date()
  const { working, daysLeftInPhase, daysIntoPhase, nextChange } = getStatus(today, INICIO_TURNO)

  const answerText = working ? '¡Sí!' : '¡No!'
  const answerColor = working ? '#cc0000' : '#009900'

  const returnLabel = capitalize(
    format(nextChange, "EEEE d 'de' MMMM", { locale: es })
  )
  const dayNoun = daysLeftInPhase === 1 ? 'día' : 'días'

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div
        className="gc-card"
        style={{
          maxWidth: '620px',
          margin: '0 auto',
          padding: '28px 32px',
        }}
      >
        {/* Título */}
        <h1
          className="font-comic"
          style={{
            margin: 0,
            color: '#800080',
            fontSize: '28px',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          ¿Está {NOMBRE} de turno?
        </h1>

        {/* Respuesta gigante */}
        <p
          className="font-comic"
          style={{
            margin: '8px 0 18px',
            fontSize: '64px',
            fontWeight: 'bold',
            color: answerColor,
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {answerText}
        </p>

        {/* Info */}
        <p style={{ margin: '0 0 6px', fontSize: '14px', textAlign: 'center' }}>
          {working ? 'Vuelve el' : 'Próximo turno el'}{' '}
          <b>{returnLabel}</b>
        </p>
        <p style={{ margin: '0 0 18px', fontSize: '14px', textAlign: 'center' }}>
          Quedan <b style={{ color: answerColor }}>{daysLeftInPhase}</b>{' '}
          {dayNoun}{' '}
          para que {working ? 'baje a casa' : 'suba a faena'}
        </p>

        {/* Progreso de bloques */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '11px',
              marginBottom: '4px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Progreso del turno</span>
            <span>Día {daysIntoPhase + 1} de 14</span>
          </div>
          <div className="progress-bar">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`progress-block ${i < daysIntoPhase + 1 ? '' : 'empty'}`}
              />
            ))}
          </div>
        </div>

        {/* Calendario */}
        <Calendar shiftStart={INICIO_TURNO} />

        {/* Pie */}
        <p
          className="font-comic"
          style={{
            margin: '20px 0 0',
            fontSize: '12px',
            color: '#800080',
            textAlign: 'center',
          }}
        >
          Hecho con ♥ por Mali
        </p>
      </div>
    </div>
  )
}
