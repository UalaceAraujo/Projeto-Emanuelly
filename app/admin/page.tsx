"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import {
  getAppointments,
  deleteAppointment,
  getBlockedSlots,
  toggleBlockedSlot,
  getCustomSlots,
  saveCustomSlots,
  removeCustomSlots,
  formatDateBR,
  type Appointment,
} from "@/lib/appointments"
import {
  BUSINESS_NAME,
  DEFAULT_TIME_SLOTS,
  SERVICES,
} from "@/lib/config"
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  Users,
  Lock,
  Unlock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react"

/**
 * PAINEL ADMINISTRATIVO
 *
 * Funcionalidades:
 * - Ver todos os agendamentos
 * - Excluir agendamentos
 * - Bloquear/desbloquear horarios por dia
 * - Adicionar horarios personalizados por dia
 *
 * Acesse via: /admin
 * EDITE: Para proteger com senha, adicione autenticacao aqui
 */
export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activeTab, setActiveTab] = useState<"appointments" | "schedule">("appointments")
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [blockedSlots, setBlockedSlots] = useState<{ date: string; time: string }[]>([])
  const [newTimeInput, setNewTimeInput] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  // Proximos 14 dias para gerenciar
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i)
    return {
      date,
      dateStr: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE, dd/MM", { locale: ptBR }),
    }
  })

  const selectedDay = days[selectedDayIndex]

  useEffect(() => {
    setAppointments(getAppointments().sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    }))
    setBlockedSlots(getBlockedSlots())
  }, [refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointment(id)
      refresh()
    }
  }

  const handleToggleBlock = (time: string) => {
    toggleBlockedSlot(selectedDay.dateStr, time)
    refresh()
  }

  const isBlocked = (time: string) =>
    blockedSlots.some((b) => b.date === selectedDay.dateStr && b.time === time)

  const isBooked = (time: string) =>
    appointments.some((a) => a.date === selectedDay.dateStr && a.time === time)

  const customSlots = getCustomSlots(selectedDay.dateStr)
  const displaySlots = customSlots || DEFAULT_TIME_SLOTS

  const handleAddTime = () => {
    if (!newTimeInput || !/^\d{2}:\d{2}$/.test(newTimeInput)) return
    const current = customSlots || [...DEFAULT_TIME_SLOTS]
    if (!current.includes(newTimeInput)) {
      const updated = [...current, newTimeInput].sort()
      saveCustomSlots(selectedDay.dateStr, updated)
      refresh()
    }
    setNewTimeInput("")
  }

  const handleRemoveCustomTime = (time: string) => {
    const current = customSlots || [...DEFAULT_TIME_SLOTS]
    const updated = current.filter((t) => t !== time)
    saveCustomSlots(selectedDay.dateStr, updated)
    refresh()
  }

  const handleResetToDefault = () => {
    removeCustomSlots(selectedDay.dateStr)
    refresh()
  }

  // Filtrar agendamentos futuros
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const futureAppointments = appointments.filter((a) => a.date >= todayStr)
  const pastAppointments = appointments.filter((a) => a.date < todayStr)

  return (
    <main className="mx-auto min-h-screen max-w-2xl pb-8">
      <div className="h-1 bg-accent" />

      {/* Cabecalho */}
      <header className="flex items-center justify-between px-4 py-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <h1 className="mt-2 font-serif text-2xl font-bold text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">{BUSINESS_NAME}</p>
        </div>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </header>

      {/* Abas */}
      <div className="mb-6 flex gap-1 px-4">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "appointments"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Users className="h-4 w-4" />
          Agendamentos ({futureAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "schedule"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Clock className="h-4 w-4" />
          Horarios
        </button>
      </div>

      {/* Conteudo: Agendamentos */}
      {activeTab === "appointments" && (
        <div className="px-4">
          {futureAppointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-8 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {futureAppointments.map((apt) => {
                const service = SERVICES.find((s) => s.id === apt.serviceId)
                return (
                  <div
                    key={apt.id}
                    className="flex items-start justify-between rounded-xl border-2 border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {apt.clientName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {apt.clientPhone}
                      </span>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {apt.serviceName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDateBR(apt.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {apt.time}
                        </span>
                      </div>
                      {service && (
                        <span className="mt-1 text-xs font-semibold text-primary">
                          R$ {service.price.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="Excluir agendamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Agendamentos passados */}
          {pastAppointments.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Historico
              </h3>
              <div className="flex flex-col gap-2">
                {pastAppointments.slice(0, 10).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3 opacity-60"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-foreground">
                        {apt.clientName} - {apt.serviceName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateBR(apt.date)} as {apt.time}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conteudo: Gerenciar Horarios */}
      {activeTab === "schedule" && (
        <div className="px-4">
          {/* Navegacao de dias */}
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
              disabled={selectedDayIndex === 0}
              className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1">
              {days.slice(Math.max(0, selectedDayIndex - 2), selectedDayIndex + 5).map((day, i) => {
                const realIndex = days.findIndex((d) => d.dateStr === day.dateStr)
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDayIndex(realIndex)}
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium capitalize transition-all ${
                      realIndex === selectedDayIndex
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))}
              disabled={selectedDayIndex === days.length - 1}
              className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold capitalize text-foreground">
              {format(selectedDay.date, "EEEE, dd/MM", { locale: ptBR })}
            </h3>
            {customSlots && (
              <button
                onClick={handleResetToDefault}
                className="text-xs text-primary underline transition-colors hover:text-primary/80"
              >
                Restaurar padrao
              </button>
            )}
          </div>

          {/* Grid de horarios */}
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {displaySlots.map((time) => {
              const blocked = isBlocked(time)
              const booked = isBooked(time)
              const apt = appointments.find(
                (a) => a.date === selectedDay.dateStr && a.time === time
              )

              return (
                <div key={time} className="relative">
                  <button
                    onClick={() => !booked && handleToggleBlock(time)}
                    disabled={booked}
                    className={`flex w-full flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-sm transition-all ${
                      booked
                        ? "border-primary/30 bg-primary/10 text-primary cursor-default"
                        : blocked
                        ? "border-destructive/30 bg-destructive/5 text-destructive/70"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                    title={
                      booked
                        ? `Agendado: ${apt?.clientName}`
                        : blocked
                        ? "Clique para desbloquear"
                        : "Clique para bloquear"
                    }
                  >
                    <span className="font-semibold">{time}</span>
                    {booked ? (
                      <span className="text-[10px] font-medium truncate max-w-full">
                        {apt?.clientName}
                      </span>
                    ) : blocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3 text-muted-foreground/40" />
                    )}
                  </button>
                  {/* Botao para remover horario custom */}
                  {customSlots && !booked && (
                    <button
                      onClick={() => handleRemoveCustomTime(time)}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white text-[10px]"
                      title="Remover horario"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Adicionar horario */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-3">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              type="time"
              value={newTimeInput}
              onChange={(e) => setNewTimeInput(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
              placeholder="00:00"
            />
            <button
              onClick={handleAddTime}
              disabled={!newTimeInput}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>

          {/* Legenda */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border-2 border-border bg-card" />
              Disponivel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-primary/20" />
              Agendado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-destructive/20" />
              Bloqueado
            </span>
          </div>
        </div>
      )}
    </main>
  )
}
