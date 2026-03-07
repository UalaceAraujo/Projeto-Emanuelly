"use client"

import { useState } from "react"
import { format, addMonths, isBefore, isToday, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { WORKING_DAYS } from "@/lib/config"

interface DatePickerProps {
  selected: Date | null
  onSelect: (date: Date) => void
}

/**
 * COMPONENTE: Calendario para selecao de data
 * Mostra apenas dias uteis conforme configuracao
 *
 * EDITE: Para alterar dias uteis, edite WORKING_DAYS em /lib/config.ts
 */
export function DatePicker({ selected, onSelect }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = startOfDay(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Dias da semana comecando na segunda
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  // Preencher dias vazios no inicio
  const startDayOfWeek = getDay(monthStart) // 0 = Domingo
  const emptyDays = Array(startDayOfWeek).fill(null)

  const isPastDay = (date: Date) => isBefore(date, today) && !isToday(date)
  const isWorkingDay = (date: Date) => WORKING_DAYS.includes(getDay(date))

  return (
    <section className="px-4">
      <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
        Escolha a Data
      </h2>
      <div className="rounded-xl border-2 border-border bg-card p-4 shadow-sm">
        {/* Navegacao do mes */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            disabled={isSameMonth(currentMonth, today)}
            className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg font-semibold capitalize text-foreground">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            disabled={isSameMonth(currentMonth, addMonths(today, 2))}
            className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Cabecalho dos dias da semana */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mes */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map((date) => {
            const disabled = isPastDay(date) || !isWorkingDay(date)
            const isSelected = selected && isSameDay(date, selected)
            const isTodayDate = isToday(date)

            return (
              <button
                key={date.toISOString()}
                onClick={() => !disabled && onSelect(date)}
                disabled={disabled}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isTodayDate
                    ? "bg-secondary text-primary font-bold"
                    : disabled
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {format(date, "d")}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
