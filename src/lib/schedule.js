// ─────────────────────────────────────────────────────────────
// Lógica del ciclo de turnos 14 × 14.
//
// El ciclo dura 28 días en total y se repite indefinidamente:
//   • Días 0..13 del ciclo → EN FAENA (trabajando)
//   • Días 14..27 del ciclo → EN CASA (descansando)
//
// Todas las funciones reciben:
//   - `date`:        la fecha que queremos consultar (cualquier Date)
//   - `shiftStart`:  el primer día de un turno de trabajo conocido
//                    (día 1 de los 14 en faena). Puede ser pasado o futuro.
// ─────────────────────────────────────────────────────────────

const MS_PER_DAY = 1000 * 60 * 60 * 24

/** Días que dura cada turno de trabajo en faena. */
export const WORK_DAYS = 14

/** Días que dura cada período de descanso en casa. */
export const HOME_DAYS = 14

/** Largo total del ciclo (faena + casa). */
export const CYCLE_LENGTH = WORK_DAYS + HOME_DAYS

/**
 * Normaliza una fecha a las 00:00 hora local.
 * Sirve para que los cálculos comparen días enteros y no se vean
 * afectados por la hora del día (ej. 23:59 vs 00:01 del día siguiente).
 *
 * @param {Date|string|number} date
 * @returns {Date} nueva instancia con hora 00:00:00.000
 */
function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Devuelve la posición de `date` dentro del ciclo de 28 días.
 *
 * El resultado es un número entero entre 0 y 27:
 *   • 0..13  → la persona está en faena ese día
 *   • 14..27 → la persona está en casa ese día
 *
 * Funciona con fechas anteriores a `shiftStart` (usa módulo positivo).
 *
 * @param {Date} date
 * @param {Date} shiftStart  primer día de un turno de trabajo conocido
 * @returns {number} entero en [0, 27]
 *
 * @example
 *   getCycleDay(new Date('2026-05-20'), new Date('2026-05-20')) // 0
 *   getCycleDay(new Date('2026-06-03'), new Date('2026-05-20')) // 14 (primer día en casa)
 */
export function getCycleDay(date, shiftStart) {
  const diff = Math.floor((startOfDay(date) - startOfDay(shiftStart)) / MS_PER_DAY)
  return ((diff % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH
}

/**
 * Indica si la persona está en faena (trabajando) en la fecha dada.
 *
 * @param {Date} date
 * @param {Date} shiftStart
 * @returns {boolean} true si está trabajando, false si está en casa
 */
export function isWorking(date, shiftStart) {
  return getCycleDay(date, shiftStart) < WORK_DAYS
}

/**
 * Devuelve un resumen completo del estado en la fecha dada.
 *
 * Útil cuando se necesita más de un dato a la vez (estado actual +
 * cuántos días faltan + cuándo cambia la fase).
 *
 * @param {Date} date
 * @param {Date} shiftStart
 * @returns {{
 *   working: boolean,          // true = en faena, false = en casa
 *   cycleDay: number,          // 0..27, posición en el ciclo
 *   daysIntoPhase: number,     // 0..13, días transcurridos en la fase actual
 *   daysLeftInPhase: number,   // 1..14, días que faltan para cambiar de fase
 *   nextChange: Date,          // fecha en que cambia la fase (vuelve o se va)
 * }}
 *
 * @example
 *   // Si hoy es el día 3 de un turno en faena:
 *   getStatus(hoy, inicio)
 *   // → { working: true, cycleDay: 3, daysIntoPhase: 3,
 *   //     daysLeftInPhase: 11, nextChange: <Date 11 días después> }
 */
export function getStatus(date, shiftStart) {
  const cycleDay = getCycleDay(date, shiftStart)
  const working = cycleDay < WORK_DAYS
  const daysIntoPhase = working ? cycleDay : cycleDay - WORK_DAYS
  const phaseLength = working ? WORK_DAYS : HOME_DAYS
  const daysLeftInPhase = phaseLength - daysIntoPhase

  const nextChange = startOfDay(date)
  nextChange.setDate(nextChange.getDate() + daysLeftInPhase)

  return {
    working,
    cycleDay,
    daysIntoPhase,
    daysLeftInPhase,
    nextChange,
  }
}
