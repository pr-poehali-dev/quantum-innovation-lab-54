import { useEffect, useState } from "react"
import { Heart, Users, Calendar, Mail, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Guest {
  email: string
  created_at: string
}

const GUESTS_URL = "https://functions.poehali.dev/297c5b04-7563-432c-8cdf-cd0e74c7ea18"

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchGuests = async () => {
    setLoading(true)
    try {
      const res = await fetch(GUESTS_URL)
      const data = await res.json()
      setGuests(data.guests || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGuests() }, [])

  return (
    <div className="min-h-screen bg-stone-950 text-amber-100 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Heart className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-200">Елизавета & Дмитрий</h1>
          <p className="text-amber-200/60 text-sm">10 июля 2026 · Список гостей</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-amber-400/70 text-xs uppercase tracking-widest">
              <Users className="w-4 h-4" />
              Подтвердили
            </div>
            <p className="text-4xl font-bold text-amber-300">{loading ? "—" : total}</p>
          </div>
          <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-amber-400/70 text-xs uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              До свадьбы
            </div>
            <p className="text-4xl font-bold text-amber-300">
              {Math.max(0, Math.ceil((new Date("2026-07-10").getTime() - Date.now()) / 86400000))}
            </p>
            <p className="text-amber-200/40 text-xs">дней</p>
          </div>
        </div>

        {/* Guest list */}
        <div className="bg-stone-900 border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/10">
            <div className="flex items-center gap-2 text-amber-200 font-semibold">
              <Mail className="w-4 h-4 text-amber-400" />
              Email-адреса гостей
            </div>
            <button
              onClick={fetchGuests}
              className="text-amber-400/60 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-amber-200/40 text-sm">
              Загружаем список...
            </div>
          ) : guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-amber-200/40 text-sm">
              <Heart className="w-6 h-6" />
              Пока никто не подтвердил
            </div>
          ) : (
            <ul>
              {guests.map((guest, i) => (
                <li
                  key={guest.email}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 text-sm",
                    i !== guests.length - 1 && "border-b border-amber-500/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-amber-100">{guest.email}</span>
                  </div>
                  <span className="text-amber-200/40 text-xs">{guest.created_at}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-amber-200/30 text-xs">
          Страница обновляется вручную — нажмите ↻ для обновления
        </p>
      </div>
    </div>
  )
}
