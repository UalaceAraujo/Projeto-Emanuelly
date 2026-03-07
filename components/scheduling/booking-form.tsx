"use client"

import { useState } from "react"
import { SERVICES, WHATSAPP_NUMBER, WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/config"
import { saveAppointment, formatDateBR } from "@/lib/appointments"
import { Send, User, Phone } from "lucide-react"

interface BookingFormProps {
  serviceId: string
  date: string
  time: string
  onSuccess: () => void
}

/**
 * COMPONENTE: Formulario de Confirmacao
 * Coleta nome/telefone e envia mensagem pelo WhatsApp
 *
 * EDITE: A mensagem do WhatsApp pode ser alterada em /lib/config.ts (WHATSAPP_MESSAGE_TEMPLATE)
 */
export function BookingForm({ serviceId, date, time, onSuccess }: BookingFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const service = SERVICES.find((s) => s.id === serviceId)
  if (!service) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setIsSubmitting(true)

    // Salvar agendamento
    saveAppointment({
      clientName: name.trim(),
      clientPhone: phone.trim(),
      serviceId: service.id,
      serviceName: service.name,
      date,
      time,
    })

    // Montar mensagem do WhatsApp
    const message = WHATSAPP_MESSAGE_TEMPLATE
      .replace("{nome}", name.trim())
      .replace("{servico}", service.name)
      .replace("{data}", formatDateBR(date))
      .replace("{horario}", time)

    /** EDITE: O numero do WhatsApp em /lib/config.ts */
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank")

    onSuccess()
    setIsSubmitting(false)
  }

  return (
    <section className="px-4">
      <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
        Seus Dados
      </h2>

      {/* Resumo do agendamento */}
      <div className="mb-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Servico:</span>
          <span className="font-semibold text-foreground">{service.name}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Data:</span>
          <span className="font-semibold text-foreground">{formatDateBR(date)}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Horario:</span>
          <span className="font-semibold text-foreground">{time}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valor:</span>
          <span className="font-bold text-primary">
            R$ {service.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !phone.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Confirmar e Enviar pelo WhatsApp
        </button>
      </form>
    </section>
  )
}
