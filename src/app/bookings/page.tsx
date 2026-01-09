"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Ticket, Calendar, MapPin, Bus as BusIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          buses (*)
        `)
        .order("created_at", { ascending: false })
      
      if (data) setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  if (loading) return <div className="p-20 text-center">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <Card className="flex h-64 flex-col items-center justify-center text-zinc-500">
          <Ticket className="mb-4 h-12 w-12 opacity-20" />
          <p>You haven't booked any tickets yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-l-4 border-l-red-600">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{booking.buses?.name}</h3>
                    <p className="text-sm text-zinc-500">{booking.buses?.type}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">From</p>
                      <p className="font-semibold">{booking.buses?.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">To</p>
                      <p className="font-semibold">{booking.buses?.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Travel Date</p>
                      <p className="font-semibold">{format(new Date(booking.booking_date), "PP")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Seats</p>
                      <p className="font-semibold">{booking.seat_numbers.join(", ")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-zinc-400 italic">
                    Booked on {format(new Date(booking.created_at), "PPp")}
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    ₹{booking.total_price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
