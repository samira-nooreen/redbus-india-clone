"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Bus, Clock, MapPin, Filter, ChevronRight, Star, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SeatSelection } from "@/components/SeatSelection"
import { format } from "date-fns"

interface BusData {
  id: string
  bus_number: string
  name: string
  type: string
  source: string
  destination: string
  departure_time: string
  arrival_time: string
  price: number
  total_seats: number
}

function SearchResults() {
  const searchParams = useSearchParams()
  const source = searchParams.get("source")
  const destination = searchParams.get("destination")
  const date = searchParams.get("date")

  const [buses, setBuses] = useState<BusData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null)
  
  // Filters
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  
  const supabase = createClient()

    useEffect(() => {
      async function fetchBuses() {
        setLoading(true)
        let query = supabase
          .from("buses")
          .select("*")
          .ilike("source", `%${source}%`)
          .ilike("destination", `%${destination}%`)

        if (date) {
          const startDate = new Date(date)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(date)
          endDate.setHours(23, 59, 59, 999)
          
          query = query
            .gte("departure_time", startDate.toISOString())
            .lte("departure_time", endDate.toISOString())
        }

        const { data, error } = await query
        if (data) setBuses(data)
        setLoading(false)
      }

      if (source && destination) {
        fetchBuses()
      }
    }, [source, destination, date])

  const filteredBuses = buses.filter(bus => {
    if (typeFilters.length > 0 && !typeFilters.includes(bus.type)) return false
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Search Header Info */}
        <div className="mb-8 flex flex-col items-center justify-between rounded-xl bg-white p-6 shadow-sm dark:bg-black md:flex-row">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-zinc-500 uppercase font-semibold">From</p>
              <p className="text-xl font-bold">{source}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-zinc-300" />
            <div className="text-center md:text-left">
              <p className="text-sm text-zinc-500 uppercase font-semibold">To</p>
              <p className="text-xl font-bold">{destination}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="mx-8 hidden h-10 md:block" />
          <div className="mt-4 text-center md:mt-0 md:text-left">
            <p className="text-sm text-zinc-500 uppercase font-semibold">Date</p>
            <p className="text-xl font-bold">{date ? format(new Date(date), "PPP") : "Any"}</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.history.back()}>
            Modify Search
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 font-bold uppercase tracking-wider text-zinc-500">
                  <Filter className="h-4 w-4" />
                  Filters
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 font-semibold">Bus Type</h4>
                    <div className="space-y-2">
                      {["AC Sleeper", "Non-AC Seater", "AC Seater"].map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox 
                            id={type} 
                            checked={typeFilters.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) setTypeFilters([...typeFilters, type])
                              else setTypeFilters(typeFilters.filter(t => t !== type))
                            }}
                          />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Bus List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{filteredBuses.length} Buses found</h2>
            
            {filteredBuses.length === 0 ? (
              <Card className="flex h-64 flex-col items-center justify-center text-zinc-500">
                <Bus className="mb-4 h-12 w-12 opacity-20" />
                <p>No buses found for this route</p>
              </Card>
            ) : (
              filteredBuses.map((bus) => (
                <div key={bus.id} className="space-y-2">
                  <Card className="overflow-hidden transition-shadow hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{bus.name}</h3>
                              <p className="text-sm text-zinc-500">{bus.type}</p>
                            </div>
                            <div className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
                              <Star className="h-3 w-3 fill-current" />
                              4.5
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-lg font-bold">{format(new Date(bus.departure_time), "HH:mm")}</p>
                                <p className="text-sm text-zinc-500">{bus.source}</p>
                              </div>
                              <div className="flex flex-col items-center px-4">
                                <span className="text-xs text-zinc-400">12h 00m</span>
                                <div className="h-px w-20 bg-zinc-200" />
                              </div>
                              <div>
                                <p className="text-lg font-bold">{format(new Date(bus.arrival_time), "HH:mm")}</p>
                                <p className="text-sm text-zinc-500">{bus.destination}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-zinc-500">Starting from</p>
                              <p className="text-2xl font-bold text-red-600">₹{bus.price}</p>
                              <p className="text-xs text-zinc-400">{bus.total_seats} Seats left</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center border-t bg-zinc-50/50 px-6 py-4 dark:bg-zinc-900/50 md:w-48 md:border-l md:border-t-0">
                          <Button 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => setSelectedBusId(selectedBusId === bus.id ? null : bus.id)}
                          >
                            {selectedBusId === bus.id ? "Close" : "Select Seats"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                    <AnimatePresence>
                      {selectedBusId === bus.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <SeatSelection bus={bus} travelDate={date} />
                          </motion.div>

                      )}
                    </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
