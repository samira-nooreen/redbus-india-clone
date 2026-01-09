"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Search, Shield, Clock, CreditCard, ChevronRight, Star, HelpCircle, Ticket, Bus, Phone, Mail, Globe, Heart, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/Footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { StationAutocomplete } from "@/components/StationAutocomplete"

export default function Home() {
  const router = useRouter()
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>(new Date())

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

  const offers = [
    { title: "Save up to Rs 250 on bus tickets", code: "FIRST", bg: "bg-red-50", text: "text-red-600", description: "Valid for first time users" },
    { title: "Get Rs 300 off on train tickets", code: "RAIL300", bg: "bg-blue-50", text: "text-blue-600", description: "Applicable on major routes" },
    { title: "Flat 10% off on your first ride", code: "NEW10", bg: "bg-green-50", text: "text-green-600", description: "For new app registrations" },
    { title: "Cashback up to Rs 500 on UPI", code: "UPI500", bg: "bg-orange-50", text: "text-orange-600", description: "Use GPay or PhonePe" },
  ]

  const govBuses = [
    { 
      name: "TGSRTC", 
      rating: "3.71", 
      logo: "https://st.redbus.in/res/images/get_status_image/TGSRTC.png", 
      subtitle: "తెలంగాణ రాష్ట్ర రోడ్డు రవాణా సంస్థ",
      services: "1450 services including Garuda Plus, Rajdhani and more",
      footerText: "Use code FIRST to save upto ₹250 (only for first-time users)"
    },
    { 
      name: "APSRTC", 
      rating: "3.85", 
      logo: "https://st.redbus.in/res/images/get_status_image/APSRTC.png", 
      subtitle: "ఆంధ్రప్రదేశ్ రాష్ట్ర రోడ్డు రవాణా సంస్థ",
      services: "1539 services including Garuda, Garuda Plus and more",
      footerText: "redBus is the most trusted place to book APSRTC tickets online"
    },
    { 
      name: "KTCL", 
      rating: "3.83", 
      logo: "https://st.redbus.in/res/images/get_status_image/KTCL.png", 
      subtitle: "कदंब येरादारी म्हामंडळ",
      services: "60 services including Volvo Bus, AC & Non AC Bus and more",
      footerText: "Use code FIRST to save upto ₹250 (only for first time users)"
    },
    { 
      name: "KERALA RTC", 
      rating: "3.85", 
      logo: "https://st.redbus.in/res/images/get_status_image/KSRTC.png", 
      subtitle: "കേരള സ്റ്റേറ്റ് റോഡ് ട്രാൻസ്പോർട്ട് കോർപ്പറേഷൻ",
      services: "940 services including Swift, AC Multiaxle and more",
      footerText: "redBus is the most trusted place to book KSRTC KERALA tickets online"
    },
  ]

  const trendingRoutes = [
    { from: "Bangalore", to: "Chennai", price: "499", time: "6h 30m" },
    { from: "Mumbai", to: "Pune", price: "299", time: "3h 00m" },
    { from: "Hyderabad", to: "Bangalore", price: "699", time: "9h 15m" },
    { from: "Delhi", to: "Chandigarh", price: "399", time: "5h 45m" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section with distinctive RedBus red gradient background */}
      <section className="relative min-h-[600px] w-full pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-white to-white" />
        
        {/* Decorative background elements */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-bold"
            >
              <Zap className="h-4 w-4" />
              <span>India's Largest Bus Ticket Booking Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[1.1]"
            >
              Your Journey <span className="text-red-600">Starts Here</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-zinc-600 max-w-2xl"
            >
              Search and book from over 2,000 operators and 25,000+ routes across India with real-time tracking.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-5xl"
          >
            <Card className="overflow-visible border-none bg-white p-1 md:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-[2rem]">
              <CardContent className="p-0">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch">
                  {/* From Field */}
                  <div className="relative flex-1 group">
                    <StationAutocomplete 
                      placeholder="From Station"
                      value={source}
                      onChange={setSource}
                      className="rounded-t-2xl md:rounded-l-[1.75rem] md:rounded-tr-none"
                    />
                    <div className="absolute bottom-0 left-14 right-6 h-px bg-zinc-100 md:hidden" />
                  </div>
                  
                  <div className="hidden w-px bg-zinc-100 md:block my-6" />
                  
                  {/* To Field */}
                  <div className="relative flex-1 group">
                    <StationAutocomplete 
                      placeholder="To Station"
                      value={destination}
                      onChange={setDestination}
                    />
                    <div className="absolute bottom-0 left-14 right-6 h-px bg-zinc-100 md:hidden" />
                  </div>
                  
                  <div className="hidden w-px bg-zinc-100 md:block my-6" />
                  
                  {/* Date Field */}
                  <div className="relative flex-1 group">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-20 w-full justify-start border-none pl-14 text-left text-xl font-bold hover:bg-transparent focus-visible:ring-0",
                            !date && "text-zinc-400"
                          )}
                        >
                          <Calendar className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
                          {date ? format(date, "dd MMM yyyy") : <span>Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setDate(d)}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Search Button */}
                  <Button type="submit" className="h-20 bg-red-600 px-12 text-2xl font-black hover:bg-red-700 rounded-b-2xl md:rounded-r-[1.75rem] md:rounded-bl-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                    SEARCH
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Offers Section with a more "designed" look */}
      <section className="bg-white py-24 border-y border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Exclusive Offers</h2>
              <p className="text-zinc-500 font-medium">Extra savings for your travel</p>
            </div>
            <Button variant="outline" className="rounded-full font-bold border-red-200 text-red-600 hover:bg-red-50">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className={cn("h-full border-none shadow-sm group-hover:shadow-xl transition-all duration-300 overflow-hidden relative", offer.bg)}>
                  <CardContent className="p-8 flex flex-col justify-between h-full min-h-[220px]">
                    <div>
                      <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Ticket className={cn("h-8 w-8", offer.text)} />
                      </div>
                      <h3 className="font-black text-lg mb-2 leading-tight">{offer.title}</h3>
                      <p className="text-sm text-zinc-500 font-medium">{offer.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Badge variant="outline" className="bg-white border-dashed border-zinc-300 font-mono text-sm py-2 px-4 rounded-lg tracking-wider font-bold">
                        {offer.code}
                      </Badge>
                      <ArrowRight className={cn("h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all", offer.text)} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section (NEW) */}
      <section className="bg-zinc-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Trending Routes</h2>
            <p className="text-zinc-500 font-medium">Most searched bus journeys in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingRoutes.map((route, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-400">FROM</span>
                      <span className="text-lg font-black">{route.from}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-red-600 group-hover:translate-x-2 transition-transform" />
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-zinc-400">TO</span>
                      <span className="text-lg font-black">{route.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <span className="text-sm font-bold text-zinc-500">{route.time}</span>
                    <span className="font-black text-red-600">starts at ₹{route.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Government Buses - Redesigned */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Government Bus Operators</h2>
              <p className="text-zinc-500 font-medium">Official booking partner of state transport corporations</p>
            </div>
            <Button variant="ghost" className="rounded-full px-8 font-bold text-zinc-600">
              Explore All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {govBuses.map((gov, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="group">
                <Card className="h-full border-zinc-100 hover:border-red-200 transition-all cursor-pointer overflow-hidden bg-white hover:shadow-xl hover:shadow-red-500/5">
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    <div className="h-24 w-full flex items-center justify-center mb-6">
                      <img 
                        src={gov.logo} 
                        alt={gov.name} 
                        className="h-20 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                    <h3 className="font-black text-xl mb-1">{gov.name}</h3>
                    <p className="text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest">{gov.state}</p>
                    <div className="flex items-center gap-1.5 text-sm font-black text-white bg-green-500 px-3 py-1 rounded-full shadow-lg shadow-green-100">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {gov.rating}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Redbus - Visual upgrade */}
      <section className="bg-zinc-900 text-white py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tight">The RedBus Advantage</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/10 group hover:bg-red-600 transition-colors duration-500">
                <Shield className="h-10 w-10 text-red-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Safety+ Certified</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">Verified operators following strict safety protocols for a worry-free journey.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/10 group hover:bg-blue-600 transition-colors duration-500">
                <Clock className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">On-Time Always</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">Advanced predictive algorithms and real-time tracking to ensure zero delays.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/10 group hover:bg-green-600 transition-colors duration-500">
                <CreditCard className="h-10 w-10 text-green-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Best Price Policy</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">No hidden charges. Transparent pricing with the best deals available in India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs - Improved styling */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <HelpCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-zinc-100 rounded-2xl px-6 data-[state=open]:border-red-100 data-[state=open]:bg-red-50/30 transition-all">
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-red-600">Can I track the location of my booked bus online?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed text-base pb-6 font-medium">
                Absolutely! Most of our premium operators provide real-time bus tracking. Once you book, you'll receive a tracking link via SMS and WhatsApp before your journey starts. You can also track directly from the 'My Bookings' section.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-zinc-100 rounded-2xl px-6 data-[state=open]:border-red-100 data-[state=open]:bg-red-50/30 transition-all">
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-red-600">What are the advantages of bus ticket booking with RedBus?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed text-base pb-6 font-medium">
                RedBus is India's pioneer in online bus booking. By booking with us, you get:
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>Choice of over 25,000 routes and 2,000+ operators</li>
                  <li>Real-time seat selection with live availability</li>
                  <li>Instant cancellation and quick refunds</li>
                  <li>Exclusive discounts with RedBus Reward Points</li>
                  <li>24/7 dedicated customer support line</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-zinc-100 rounded-2xl px-6 data-[state=open]:border-red-100 data-[state=open]:bg-red-50/30 transition-all">
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-red-600">Do I need to create an account on RedBus to book a ticket?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed text-base pb-6 font-medium">
                While you can book as a guest, we highly recommend creating an account. It allows you to manage your bookings effortlessly, track refund statuses instantly, and access personalized offers that aren't available to guest users.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
