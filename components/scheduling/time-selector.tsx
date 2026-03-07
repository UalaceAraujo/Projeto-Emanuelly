"use client"

import { getAvailableSlots } from "@/lib/appointments"
import { DEFAULT_TIME_SLOTS } from "@/lib/config"
import { Clock } from "lucide-react"

interface TimeSelectorProps {
  date: string // YYYY-MM-DD
  selected: string | null
  onSelect: (time: string) => void
}

/**
 * COMPONENTE: Seletor de Horarios
 * Exibe horarios disponiveis para a data escolhida
 *
 * EDITE: Para alterar horarios padrao, edite DEFAULT_TIME_SLOTS em /lib/config.ts
 */
export function TimeSelector({ date, selected, onSelect }: TimeSelectorProps) {
  const availableSlots = getAvailableSlots(date, DEFAULT_TIME_SLOTS)

  if (availableSlots.length === 0) {
    return (
      <section className="px-4">
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Escolha o Horario
        </h2>
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-8 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nenhum horario disponivel para esta data.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Tente selecionar outro dia.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4">
      <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
        Escolha o Horario
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {availableSlots.map((time) => {
          const isSelected = selected === time
          return (
            <button
              key={time}
              onClick={() => onSelect(time)}
              className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {time}
            </button>
          )
        })}
      </div>
    </section>
  )
}
