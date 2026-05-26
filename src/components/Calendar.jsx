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

function ChevronLeft(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02z" />
    </svg>
  )
}

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z" />
    </svg>
  )
}

export default function Calendar({ shiftStart }) {
  const [viewMonth, setViewMonth] = useState(new Date())
  const today = new Date()

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const [monthName, yearLabel] = capitalize(
    format(viewMonth, 'MMMM yyyy', { locale: es })
  ).split(' ')

  return (
    <div className="rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-5 md:p-7 shadow-2xl shadow-black/30">
      {/* Header del calendario */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-700/70 bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:border-slate-500 hover:bg-slate-800 transition"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <h3 className="flex items-baseline gap-2 text-center">
          <span className="text-lg md:text-xl font-semibold tracking-tight text-slate-100">
            {monthName}
          </span>
          <span className="text-sm md:text-base text-slate-500 tabular">{yearLabel}</span>
        </h3>

        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-700/70 bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:border-slate-500 hover:bg-slate-800 transition"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Encabezados de día de semana */}
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] md:text-xs uppercase tracking-[0.15em] text-slate-500"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grilla de días */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewMonth)
          const working = isWorking(day, shiftStart)
          const isCurrent = isSameDay(day, today)

          const base =
            'relative aspect-square flex items-center justify-center rounded-xl text-sm md:text-base tabular transition-colors'
          const phase = working
            ? 'bg-amber-500/[0.08] text-amber-200/90 border border-amber-500/20 hover:bg-amber-500/15'
            : 'bg-sky-500/[0.08] text-sky-200/90 border border-sky-500/20 hover:bg-sky-500/15'
          const fade = inMonth ? '' : 'opacity-25'
          const todayCls = isCurrent
            ? working
              ? 'bg-amber-500/25 text-amber-100 border-amber-400/60 font-semibold shadow-[0_0_0_1px_rgba(251,191,36,0.4)]'
              : 'bg-sky-500/25 text-sky-100 border-sky-400/60 font-semibold shadow-[0_0_0_1px_rgba(56,189,248,0.4)]'
            : ''

          return (
            <div
              key={day.toISOString()}
              className={`${base} ${phase} ${fade} ${todayCls}`}
              title={working ? 'En faena' : 'En casa'}
            >
              {format(day, 'd')}
              {isCurrent && (
                <span
                  className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                    working ? 'bg-amber-300' : 'bg-sky-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Leyenda + acción */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/40 pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-amber-500/40 bg-amber-500/20" />
            <span>En faena</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-sky-500/40 bg-sky-500/20" />
            <span>En casa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-200" />
            <span>Hoy</span>
          </div>
        </div>
        <button
          onClick={() => setViewMonth(new Date())}
          className="text-xs text-slate-400 hover:text-slate-100 underline-offset-4 hover:underline transition"
        >
          Ir al mes actual
        </button>
      </div>
    </div>
  )
}
