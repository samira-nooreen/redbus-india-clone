"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Calendar, Search, Shield, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function Home() {
  const router = useRouter()
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!source || !destination || !date) return
    
    const params = new URLSearchParams({
      source,
      destination,
      date: format(date, "yyyy-MM-dd")
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80')",
            filter: "brightness(0.6)" 
          }}
        />
        
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl"
          >
            India's No. 1 Online Bus Ticket Booking Site
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <Card className="border-none bg-white p-2 shadow-2xl">
              <CardContent className="p-0">
                <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <Input 
                      placeholder="From Station" 
                      className="h-14 border-none pl-10 text-lg focus-visible:ring-0"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="hidden h-10 w-px bg-zinc-200 md:block" />
                  
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <Input 
                      placeholder="To Station" 
                      className="h-14 border-none pl-10 text-lg focus-visible:ring-0"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="hidden h-10 w-px bg-zinc-200 md:block" />
                  
                  <div className="relative flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-14 w-full justify-start border-none pl-10 text-left text-lg font-normal hover:bg-transparent focus-visible:ring-0",
                            !date && "text-zinc-400"
                          )}
                        >
                          <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                          {date ? format(date, "PPP") : <span>Travel Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button type="submit" className="h-14 bg-red-600 px-8 text-lg font-bold hover:bg-red-700">
                    SEARCH BUSES
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why book with RedBus?</h2>
            <p className="mt-2 text-zinc-500">We provide the best bus booking experience in India</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Safe & Secure",
                desc: "We prioritize your safety with verified operators and secure payments.",
                icon: Shield,
                color: "text-green-600",
                bg: "bg-green-100"
              },
              {
                title: "24/7 Support",
                desc: "Our dedicated support team is available around the clock to assist you.",
                icon: Clock,
                color: "text-blue-600",
                bg: "bg-blue-100"
              },
              {
                title: "Best Offers",
                desc: "Get the best deals and discounts on your bus ticket bookings.",
                icon: CreditCard,
                color: "text-red-600",
                bg: "bg-red-100"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className={cn("mb-6 rounded-2xl p-4", feature.bg)}>
                      <feature.icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                    <p className="text-zinc-500">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="max-w-xl">
              <h2 className="mb-6 text-4xl font-bold leading-tight">
                Millions of happy travelers trust us every year
              </h2>
              <p className="mb-8 text-lg text-zinc-600">
                Join over 25 million happy customers who use RedBus to book their travel. 
                With over 3,500 bus operators and 1.5 lakh routes, we are the world's 
                largest online bus ticket booking platform.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-red-600">25M+</div>
                  <div className="text-zinc-500">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">3500+</div>
                  <div className="text-zinc-500">Bus Operators</div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-2xl md:h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" 
                alt="Bus Travel"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
