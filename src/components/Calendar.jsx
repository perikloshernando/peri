import { useState } from 'react'
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { isWorking } from '../lib/schedule'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Calendar({ shiftStart }) {
  const [viewMonth, setViewMonth] = useState(new Date())
  const today = new Date()

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const monthLabel = capitalize(format(viewMonth, 'MMMM yyyy', { locale: es }))

  return (
    <div>
      {/* Cabecera */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          gap: '8px',
        }}
      >
        <button
          className="btn-gc"
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          aria-label="Mes anterior"
        >
          {'<<'}
        </button>

        <h2
          className="font-comic"
          style={{
            margin: 0,
            color: '#000080',
            fontWeight: 'bold',
            fontSize: '20px',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {monthLabel}
        </h2>

        <button
          className="btn-gc"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          aria-label="Mes siguiente"
        >
          {'>>'}
        </button>
      </div>

      {/* Calendario en tabla */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000000',
          background: '#ffffff',
        }}
      >
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th
                key={d}
                style={{
                  border: '1px solid #000000',
                  background: '#000080',
                  color: '#ffff00',
                  padding: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIdx) => (
            <tr key={weekIdx}>
              {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                const inMonth = isSameMonth(day, viewMonth)
                const working = isWorking(day, shiftStart)
                const isCurrent = isSameDay(day, today)

                const bg = working ? '#ffb3b3' : '#b3ffb3'

                return (
                  <td
                    key={day.toISOString()}
                    title={working ? 'En faena' : 'En casa'}
                    style={{
                      border: isCurrent ? '2px solid #ff33cc' : '1px solid #000000',
                      background: bg,
                      color: '#000000',
                      textAlign: 'center',
                      padding: '8px 0',
                      width: '14.28%',
                      fontSize: '14px',
                      fontFamily: '"PT Sans", Verdana, sans-serif',
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      opacity: inMonth ? 1 : 0.45,
                    }}
                  >
                    {format(day, 'd')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Leyenda */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: '#ffb3b3',
                border: '1px solid #000000',
              }}
            />
            En faena
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: '#b3ffb3',
                border: '1px solid #000000',
              }}
            />
            En casa
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: '#ffffff',
                border: '2px solid #ff33cc',
              }}
            />
            Hoy
          </span>
        </div>

        <button className="btn-gc" onClick={() => setViewMonth(new Date())}>
          Mes actual
        </button>
      </div>
    </div>
  )
}
