"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2, Bus, MapPinned, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

interface Station {
  name: string
  city?: string
  type: 'boarding_point' | 'city'
}

interface StationAutocompleteProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
  icon?: React.ReactNode
}

export function StationAutocomplete({
  placeholder,
  value,
  onChange,
  className,
  icon = <Bus className="h-5 w-5" />
}: StationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Station[]>([])
  const [allStations, setAllStations] = useState<Station[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Mock popular data as seen in the image
  const popularBoardingPoints: Station[] = [
    { name: "Kukatpally", city: "Hyderabad", type: 'boarding_point' },
    { name: "Lakdikapul", city: "Hyderabad", type: 'boarding_point' },
    { name: "Miyapur", city: "Hyderabad", type: 'boarding_point' },
    { name: "Central Bus Station (CBS)", city: "Hyderabad", type: 'boarding_point' },
  ]

  const popularCities: Station[] = [
    { name: "Hyderabad", type: 'city' },
    { name: "Guntur (Andhra Pradesh)", type: 'city' },
    { name: "Bangalore", type: 'city' },
    { name: "Chennai", type: 'city' },
  ]

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('buses')
          .select('source, destination')

        if (error) throw error

        const cities = new Set<string>()
        data.forEach(bus => {
          if (bus.source) cities.add(bus.source)
          if (bus.destination) cities.add(bus.destination)
        })
        
        // Add defaults if DB is empty
        const defaultCities = ["Mumbai", "Pune", "Delhi", "Chandigarh", "Kochi", "Coimbatore"]
        defaultCities.forEach(s => cities.add(s))

        const formattedStations: Station[] = [
          ...Array.from(cities).map(city => ({ name: city, type: 'city' as const })),
          ...popularBoardingPoints
        ]

        setAllStations(formattedStations)
      } catch (err) {
        console.error("Error fetching stations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  useEffect(() => {
    if (value.trim().length > 0) {
      const filtered = allStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city?.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 8))
      setIsOpen(true)
    } else {
      setSuggestions([])
    }
  }, [value, allStations])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const displaySuggestions = value.trim().length === 0 ? 
    [...popularBoardingPoints.slice(0, 4), ...popularCities.slice(0, 2)] : 
    suggestions

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors z-10">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      </div>
      <div className="relative h-20 w-full group">
        <label className="absolute left-14 top-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-focus-within:opacity-100 transition-opacity">
          {placeholder.split(' ')[0]}
        </label>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="h-full border-none pl-14 pt-2 text-xl font-bold focus-visible:ring-0 placeholder:text-zinc-400 bg-transparent w-full"
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-[105%] left-0 right-0 z-[100] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px]">
          
          {value.trim().length === 0 ? (
            <div className="py-2">
              <div className="px-6 py-4">
                <h4 className="text-sm font-black text-zinc-900 mb-1">Popular Boarding Points near you</h4>
              </div>
              <div className="divide-y divide-zinc-50">
                {popularBoardingPoints.map((point, idx) => (
                  <button
                    key={`bp-${idx}`}
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 transition-colors group/item"
                    onClick={() => {
                      onChange(point.name)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[15px] text-zinc-900">{point.name}</span>
                      <span className="text-[13px] text-zinc-400 font-medium">{point.city}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight opacity-0 group-hover/item:opacity-100 transition-opacity">Board at</span>
                  </button>
                ))}
              </div>

              <div className="px-6 py-4 mt-2 border-t border-zinc-50">
                <h4 className="text-sm font-black text-zinc-900 mb-1">Popular Cities near you</h4>
              </div>
              <div className="divide-y divide-zinc-50">
                {popularCities.map((city, idx) => (
                  <button
                    key={`city-${idx}`}
                    type="button"
                    className="flex w-full items-center px-6 py-4 text-left hover:bg-zinc-50 transition-colors"
                    onClick={() => {
                      onChange(city.name)
                      setIsOpen(false)
                    }}
                  >
                    <span className="font-bold text-[15px] text-zinc-900">{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50 py-2">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 transition-colors group/item"
                    onClick={() => {
                      onChange(suggestion.name)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[15px] text-zinc-900">{suggestion.name}</span>
                      {suggestion.city && (
                        <span className="text-[13px] text-zinc-400 font-medium">{suggestion.city}</span>
                      )}
                    </div>
                    {suggestion.type === 'boarding_point' && (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Boarding Point</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-zinc-500 font-medium">
                  No stations found for "{value}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
