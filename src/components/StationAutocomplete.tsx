"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

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
  icon = <MapPin className="h-5 w-5" />
}: StationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allStations, setAllStations] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('buses')
          .select('source, destination')

        if (error) throw error

        const stations = new Set<string>()
        data.forEach(bus => {
          if (bus.source) stations.add(bus.source)
          if (bus.destination) stations.add(bus.destination)
        })
        
        // Add some default trending stations if DB is empty for demo
        const defaultStations = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune", "Delhi", "Chandigarh", "Kochi", "Coimbatore"]
        defaultStations.forEach(s => stations.add(s))

        setAllStations(Array.from(stations).sort())
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
        station.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(filtered.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
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

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors z-10">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim().length > 0 && setIsOpen(true)}
        className="h-20 border-none pl-14 text-xl font-bold focus-visible:ring-0 placeholder:text-zinc-400 bg-transparent w-full"
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="flex w-full items-center gap-3 px-6 py-4 text-left hover:bg-red-50 transition-colors group/item"
              onClick={() => {
                onChange(suggestion)
                setIsOpen(false)
              }}
            >
              <div className="rounded-lg bg-zinc-50 p-2 group-hover/item:bg-red-100 transition-colors">
                <MapPin className="h-4 w-4 text-zinc-400 group-hover/item:text-red-600" />
              </div>
              <div>
                <div className="font-bold text-zinc-900">{suggestion}</div>
                <div className="text-xs text-zinc-400 font-medium">Popular Station</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
