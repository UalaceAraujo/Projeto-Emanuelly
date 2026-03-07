"use client"

import { CheckCircle, CalendarPlus } from "lucide-react"

interface SuccessMessageProps {
  onReset: () => void
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <section className="px-4">
      <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-primary/20 bg-card p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            Agendamento Realizado!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sua solicitacao foi enviada pelo WhatsApp. Aguarde a confirmacao.
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
        >
          <CalendarPlus className="h-4 w-4" />
          Novo Agendamento
        </button>
      </div>
    </section>
  )
}
