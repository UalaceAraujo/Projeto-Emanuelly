"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/scheduling/header"
import { ServiceSelector } from "@/components/scheduling/service-selector"
import { DatePicker } from "@/components/scheduling/date-picker"
import { TimeSelector } from "@/components/scheduling/time-selector"
import { BookingForm } from "@/components/scheduling/booking-form"
import { SuccessMessage } from "@/components/scheduling/success-message"
import { Footer } from "@/components/scheduling/footer"

/**
 * PAGINA PRINCIPAL DE AGENDAMENTO
 *
 * Fluxo: Servico -> Data -> Horario -> Dados -> WhatsApp
 *
 * Para personalizar:
 * - Servicos, horarios e dados: edite /lib/config.ts
 * - Logo: substitua /public/images/logo.png
 * - Cores: edite /app/globals.css
 */
export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null

  const handleReset = () => {
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setShowSuccess(false)
  }

  // Calcular etapa atual
  const currentStep = !selectedService
    ? 1
    : !selectedDate
    ? 2
    : !selectedTime
    ? 3
    : 4

  return (
    <main className="mx-auto min-h-screen max-w-lg">
      {/* Decoracao superior delicada */}
      <div className="h-1 bg-primary/20" />
      <div className="h-px bg-primary/10" />

      <Header />

      {/* Indicador de etapas */}
      {!showSuccess && (
        <div className="mb-6 flex items-center justify-center gap-2 px-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  step === currentStep
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : step < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div
                  className={`h-px w-6 ${
                    step < currentStep ? "bg-primary/40" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 pb-8">
        {showSuccess ? (
          <SuccessMessage onReset={handleReset} />
        ) : (
          <>
            {/* Etapa 1: Servico */}
            <ServiceSelector
              selected={selectedService}
              onSelect={(id) => {
                setSelectedService(id)
                setSelectedTime(null)
              }}
            />

            {/* Etapa 2: Data */}
            {selectedService && (
              <DatePicker
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
              />
            )}

            {/* Etapa 3: Horario */}
            {selectedService && dateStr && (
              <TimeSelector
                date={dateStr}
                selected={selectedTime}
                onSelect={setSelectedTime}
              />
            )}

            {/* Etapa 4: Formulario */}
            {selectedService && dateStr && selectedTime && (
              <BookingForm
                serviceId={selectedService}
                date={dateStr}
                time={selectedTime}
                onSuccess={() => setShowSuccess(true)}
              />
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
