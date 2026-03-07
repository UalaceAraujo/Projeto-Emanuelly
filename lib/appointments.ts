import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  serviceId: string
  serviceName: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  createdAt: string
}

export interface BlockedSlot {
  date: string
  time: string
}

const APPOINTMENTS_KEY = "studio_appointments"
const BLOCKED_SLOTS_KEY = "studio_blocked_slots"
const CUSTOM_SLOTS_KEY = "studio_custom_slots"

// --- Agendamentos ---

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(APPOINTMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAppointment(appointment: Omit<Appointment, "id" | "createdAt">): Appointment {
  const appointments = getAppointments()
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  appointments.push(newAppointment)
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
  return newAppointment
}

export function deleteAppointment(id: string): void {
  const appointments = getAppointments().filter((a) => a.id !== id)
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
}

// --- Horarios Bloqueados ---

export function getBlockedSlots(): BlockedSlot[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(BLOCKED_SLOTS_KEY)
  return data ? JSON.parse(data) : []
}

export function toggleBlockedSlot(date: string, time: string): void {
  const blocked = getBlockedSlots()
  const index = blocked.findIndex((b) => b.date === date && b.time === time)
  if (index >= 0) {
    blocked.splice(index, 1)
  } else {
    blocked.push({ date, time })
  }
  localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(blocked))
}

// --- Horarios Customizados por Dia ---

export function getCustomSlots(date: string): string[] | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CUSTOM_SLOTS_KEY)
  const allCustom: Record<string, string[]> = data ? JSON.parse(data) : {}
  return allCustom[date] || null
}

export function saveCustomSlots(date: string, slots: string[]): void {
  const data = localStorage.getItem(CUSTOM_SLOTS_KEY)
  const allCustom: Record<string, string[]> = data ? JSON.parse(data) : {}
  allCustom[date] = slots
  localStorage.setItem(CUSTOM_SLOTS_KEY, JSON.stringify(allCustom))
}

export function removeCustomSlots(date: string): void {
  const data = localStorage.getItem(CUSTOM_SLOTS_KEY)
  const allCustom: Record<string, string[]> = data ? JSON.parse(data) : {}
  delete allCustom[date]
  localStorage.setItem(CUSTOM_SLOTS_KEY, JSON.stringify(allCustom))
}

// --- Utilitarios ---

export function isSlotAvailable(date: string, time: string, defaultSlots: string[]): boolean {
  const customSlots = getCustomSlots(date)
  const availableSlots = customSlots || defaultSlots

  if (!availableSlots.includes(time)) return false

  const blocked = getBlockedSlots()
  if (blocked.some((b) => b.date === date && b.time === time)) return false

  const appointments = getAppointments()
  if (appointments.some((a) => a.date === date && a.time === time)) return false

  return true
}

export function getAvailableSlots(date: string, defaultSlots: string[]): string[] {
  const customSlots = getCustomSlots(date)
  const slots = customSlots || defaultSlots
  return slots.filter((time) => isSlotAvailable(date, time, defaultSlots))
}

export function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}
