"use client"

import { SERVICES } from "@/lib/config"
import { Clock, Sparkles } from "lucide-react"

interface ServiceSelectorProps {
  selected: string | null
  onSelect: (id: string) => void
}

/**
 * COMPONENTE: Seletor de Servicos
 * Exibe os servicos disponiveis em cards elegantes
 *
 * EDITE: Para alterar servicos, edite o arquivo /lib/config.ts
 */
export function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  return (
    <section className="px-4">
      <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
        Escolha o Servico
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {SERVICES.map((service) => {
          const isSelected = selected === service.id
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`group relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {service.name}
                </span>
                <span className="text-sm font-bold text-primary">
                  R$ {service.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {service.duration} min
              </span>

              {/* Indicador de selecionado */}
              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
