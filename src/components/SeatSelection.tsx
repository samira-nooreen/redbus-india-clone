"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

interface SeatSelectionProps {
  busId: string
  price: number
  travelDate: string | null
}

export function SeatSelection({ busId, price, travelDate }: SeatSelectionProps) {
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [reservedSeats, setReservedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchReservedSeats() {
      if (!busId || !travelDate) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("seat_numbers")
        .eq("bus_id", busId)
        .eq("booking_date", travelDate)
        .eq("status", "confirmed")

      if (data) {
        const booked = data.flatMap(booking => booking.seat_numbers)
        setReservedSeats(booked)
      }
      setLoading(false)
    }

    fetchReservedSeats()
  }, [busId, travelDate])
  
  const toggleSeat = (seatId: string) => {
    if (reservedSeats.includes(seatId)) return
    
    setSelectedSeats((prev) => 
      prev.includes(seatId) 
        ? prev.filter((id) => id !== seatId) 
        : [...prev, seatId]
    )
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) return
    const params = new URLSearchParams({
      busId,
      seats: selectedSeats.join(","),
      total: (selectedSeats.length * price).toString(),
      date: travelDate || ""
    })
    router.push(`/checkout?${params.toString()}`)
  }

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const cols = [1, 2, 3, 4]

  return (
    <Card className="mt-2 border-t-4 border-t-red-600 bg-zinc-50 dark:bg-zinc-900/50">
      <CardContent className="p-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Seat Layout */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Select Seats</h4>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded border border-zinc-300 bg-white" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-zinc-300" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-red-600" />
                  <span>Selected</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-fit rounded-xl border-2 border-zinc-200 bg-white p-6 dark:bg-black">
              {/* Driver Seat */}
              <div className="mb-8 flex justify-end">
                <div className="h-8 w-8 rounded bg-zinc-200" title="Driver" />
              </div>

              <div className="grid gap-4">
                {rows.map((row) => (
                  <div key={row} className="flex gap-4">
                    <div className="flex gap-2">
                      {cols.slice(0, 2).map((col) => {
                        const seatId = `${row}${col}`
                        const isReserved = reservedSeats.includes(seatId)
                        const isSelected = selectedSeats.includes(seatId)
                        
                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isReserved}
                            className={cn(
                              "h-8 w-8 rounded text-[10px] font-bold transition-all",
                              isReserved && "cursor-not-allowed bg-zinc-200 text-zinc-400",
                              isSelected && "bg-red-600 text-white shadow-lg shadow-red-200",
                              !isReserved && !isSelected && "border border-zinc-300 bg-white hover:border-red-600 hover:text-red-600"
                            )}
                          >
                            {seatId}
                          </button>
                        )
                      })}
                    </div>
                    
                    <div className="w-8" /> {/* Aisle */}
                    
                    <div className="flex gap-2">
                      {cols.slice(2, 4).map((col) => {
                        const seatId = `${row}${col}`
                        const isReserved = reservedSeats.includes(seatId)
                        const isSelected = selectedSeats.includes(seatId)
                        
                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isReserved}
                            className={cn(
                              "h-8 w-8 rounded text-[10px] font-bold transition-all",
                              isReserved && "cursor-not-allowed bg-zinc-200 text-zinc-400",
                              isSelected && "bg-red-600 text-white shadow-lg shadow-red-200",
                              !isReserved && !isSelected && "border border-zinc-300 bg-white hover:border-red-600 hover:text-red-600"
                            )}
                          >
                            {seatId}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Details */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-6 dark:bg-black">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-bold uppercase tracking-wider text-zinc-500">Boarding & Dropping</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-bold">Bangalore (Majestic)</p>
                      <p className="text-sm text-zinc-500">21:00, 15 Feb</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                    <div>
                      <p className="font-bold">Mumbai (Borivali)</p>
                      <p className="text-sm text-zinc-500">10:00, 16 Feb</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 font-bold uppercase tracking-wider text-zinc-500">Seat Details</h4>
                {selectedSeats.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat} variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          Seat {seat}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-red-600">₹{selectedSeats.length * price}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 italic">No seats selected</p>
                )}
              </div>
            </div>

            <Button 
              className="mt-8 h-14 w-full bg-red-600 text-lg font-bold hover:bg-red-700"
              disabled={selectedSeats.length === 0}
              onClick={handleContinue}
            >
              PROCEED TO BOOK
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
