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
  variant?: 'home' | 'search'
}

export function StationAutocomplete({
  placeholder,
  value,
  onChange,
  className,
  icon = <Bus className="h-5 w-5" />,
  variant = 'home'
}: StationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Station[]>([])
  const [allStations, setAllStations] = useState<Station[]>([])
  const [recentSearches, setRecentSearches] = useState<Station[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Mock popular data
  const popularBoardingPoints: Station[] = [
    { name: "Kukatpally", city: "Hyderabad", type: 'boarding_point' },
    { name: "Lakdikapul", city: "Hyderabad", type: 'boarding_point' },
    { name: "Miyapur", city: "Hyderabad", type: 'boarding_point' },
    { name: "Central Bus Station (CBS)", city: "Hyderabad", type: 'boarding_point' },
    { name: "Silk Board", city: "Bangalore", type: 'boarding_point' },
    { name: "Majestic", city: "Bangalore", type: 'boarding_point' },
  ]

  const popularCities: Station[] = [
    { name: "Hyderabad", type: 'city' },
    { name: "Bangalore", type: 'city' },
    { name: "Chennai", type: 'city' },
    { name: "Mumbai", type: 'city' },
    { name: "Pune", type: 'city' },
    { name: "Vijayawada", type: 'city' },
    { name: "Guntur", type: 'city' },
    { name: "Visakhapatnam", type: 'city' },
  ]

  useEffect(() => {
    // Load recent searches from local storage
    const saved = localStorage.getItem('recent_station_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 3))
      } catch (e) {
        console.error("Failed to parse recent searches")
      }
    }

    const fetchStations = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('buses')
          .select('source, destination')

        if (error) throw error

        const cities = new Set<string>()
        data?.forEach(bus => {
          if (bus.source) cities.add(bus.source)
          if (bus.destination) cities.add(bus.destination)
        })
        
        const defaultCities = ["Mumbai", "Pune", "Delhi", "Chandigarh", "Kochi", "Coimbatore", "Goa", "Jaipur"]
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
      const searchTerm = value.toLowerCase()
      const filtered = allStations.filter(station =>
        station.name.toLowerCase().includes(searchTerm) ||
        station.city?.toLowerCase().includes(searchTerm)
      )
      
      // Sort: Exact matches first, then starts with, then includes
      const sorted = [...filtered].sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()
        
        if (aName === searchTerm) return -1
        if (bName === searchTerm) return 1
        if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1
        if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1
        return 0
      })

      setSuggestions(sorted.slice(0, 10))
    } else {
      setSuggestions([])
    }
  }, [value, allStations])

  const handleSelect = (station: Station) => {
    onChange(station.name)
    setIsOpen(false)
    
    // Save to recent searches
    const newRecent = [station, ...recentSearches.filter(s => s.name !== station.name)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('recent_station_searches', JSON.stringify(newRecent))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isHome = variant === 'home'

  return (
    <div className={cn("relative w-full h-full", className)} ref={containerRef}>
      <div className={cn(
        "absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors z-10",
        !isHome && "left-4"
      )}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      </div>
      
      <div className="relative h-full w-full group">
        {isHome && (
          <label className="absolute left-14 top-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-focus-within:opacity-100 transition-opacity">
            {placeholder}
          </label>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "h-full border-none pl-14 text-xl font-bold focus-visible:ring-0 placeholder:text-zinc-400 bg-transparent w-full transition-all",
            isHome ? "pt-2" : "pl-12 text-base font-semibold"
          )}
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[999] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[340px]">
          
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {value.trim().length === 0 ? (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <>
                    <div className="px-6 py-3 flex items-center gap-2 text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <h4 className="text-[11px] font-black uppercase tracking-widest">Recent Searches</h4>
                    </div>
                    <div className="mb-2">
                      {recentSearches.map((station, idx) => (
                        <button
                          key={`recent-${idx}`}
                          type="button"
                          className="flex w-full items-center px-6 py-3 text-left hover:bg-zinc-50 transition-colors"
                          onClick={() => handleSelect(station)}
                        >
                          <span className="font-bold text-[15px] text-zinc-700">{station.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="px-6 py-3 bg-zinc-50/50">
                  <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPinned className="h-4 w-4" />
                    Popular Boarding Points
                  </h4>
                </div>
                <div className="divide-y divide-zinc-50">
                  {popularBoardingPoints.map((point, idx) => (
                    <button
                      key={`bp-${idx}`}
                      type="button"
                      className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 transition-colors group/item"
                      onClick={() => handleSelect(point)}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[15px] text-zinc-900">{point.name}</span>
                        <span className="text-[13px] text-zinc-400 font-medium">{point.city}</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight opacity-0 group-hover/item:opacity-100 transition-opacity">Board at</span>
                    </button>
                  ))}
                </div>

                <div className="px-6 py-3 mt-2 bg-zinc-50/50">
                  <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Popular Cities
                  </h4>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-zinc-50">
                  {popularCities.map((city, idx) => (
                    <button
                      key={`city-${idx}`}
                      type="button"
                      className="flex w-full items-center px-6 py-4 text-left hover:bg-zinc-50 transition-colors font-bold text-[14px] text-zinc-700"
                      onClick={() => handleSelect(city)}
                    >
                      {city.name}
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
                      onClick={() => handleSelect(suggestion)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover/item:bg-red-50 transition-colors">
                          {suggestion.type === 'city' ? <Building2 className="h-5 w-5 text-zinc-400 group-hover/item:text-red-500" /> : <MapPin className="h-5 w-5 text-zinc-400 group-hover/item:text-red-500" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[15px] text-zinc-900">{suggestion.name}</span>
                          {suggestion.city && (
                            <span className="text-[13px] text-zinc-400 font-medium">{suggestion.city}</span>
                          )}
                        </div>
                      </div>
                      {suggestion.type === 'boarding_point' && (
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Boarding Point</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Bus className="h-12 w-12 text-zinc-100 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">No stations found for "{value}"</p>
                    <p className="text-sm text-zinc-400 mt-1">Try searching for a different city</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

