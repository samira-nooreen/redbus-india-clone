"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Calendar, Search, Shield, Clock, CreditCard, ChevronRight, Star, HelpCircle, Ticket, Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/Footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    { title: "Save up to Rs 250 on bus tickets", code: "FIRST", bg: "bg-red-50", text: "text-red-600" },
    { title: "Get Rs 300 off on train tickets", code: "RAIL300", bg: "bg-blue-50", text: "text-blue-600" },
    { title: "Flat 10% off on your first ride", code: "NEW10", bg: "bg-green-50", text: "text-green-600" },
    { title: "Cashback up to Rs 500 on UPI", code: "UPI500", bg: "bg-orange-50", text: "text-orange-600" },
  ]

  const govBuses = [
    { name: "TGSRTC", rating: "3.71", logo: "https://st.redbus.in/res/images/get_status_image/TGSRTC.png" },
    { name: "APSRTC", rating: "3.85", logo: "https://st.redbus.in/res/images/get_status_image/APSRTC.png" },
    { name: "KTCL", rating: "3.83", logo: "https://st.redbus.in/res/images/get_status_image/KTCL.png" },
    { name: "RSRTC", rating: "3.62", logo: "https://st.redbus.in/res/images/get_status_image/RSRTC.png" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[560px] w-full pt-20 pb-32">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://st.redbus.in/Images/rdc/rdc-redbus-logo.webp')",
            backgroundSize: 'contain',
            backgroundPosition: 'center 100px',
            opacity: 0.1
          }}
        />
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl"
          >
            India's No. 1 Online Bus Ticket Booking Site
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-5xl"
          >
            <Card className="overflow-visible border-none bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <CardContent className="p-0">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-stretch">
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="From Station" 
                      className="h-16 border-none pl-12 text-lg font-medium focus-visible:ring-0 placeholder:text-zinc-400"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-0 left-12 right-4 h-px bg-zinc-100 md:hidden" />
                  </div>
                  
                  <div className="hidden w-px bg-zinc-100 md:block my-3" />
                  
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="To Station" 
                      className="h-16 border-none pl-12 text-lg font-medium focus-visible:ring-0 placeholder:text-zinc-400"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-0 left-12 right-4 h-px bg-zinc-100 md:hidden" />
                  </div>
                  
                  <div className="hidden w-px bg-zinc-100 md:block my-3" />
                  
                  <div className="relative flex-1 group">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-16 w-full justify-start border-none pl-12 text-left text-lg font-medium hover:bg-transparent focus-visible:ring-0",
                            !date && "text-zinc-400"
                          )}
                        >
                          <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
                          {date ? format(date, "dd MMM yyyy") : <span>Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setDate(d)}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button type="submit" className="h-16 bg-red-600 px-10 text-xl font-bold hover:bg-red-700 rounded-lg md:rounded-l-none">
                    SEARCH
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Offers for you</h2>
            <Button variant="link" className="text-red-600 font-bold">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, i) => (
              <Card key={i} className={cn("border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden", offer.bg)}>
                <CardContent className="p-6 flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <Ticket className={cn("h-6 w-6", offer.text)} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-2">{offer.title}</p>
                    <Badge variant="outline" className="bg-white border-dashed border-zinc-300 font-mono text-xs py-1 px-3">
                      {offer.code}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-zinc-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-red-600 to-red-500 text-white border-none p-8 md:p-12 overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">25,000+ people booked from Hyderabad</h2>
                <p className="text-red-50 opacity-90 text-lg">on redBus last month. Join them and get the best deals on your bus travel.</p>
              </div>
              <Button size="lg" className="bg-white text-red-600 font-bold hover:bg-red-50 text-lg px-8 h-14">
                Book Now
              </Button>
            </div>
            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </Card>
        </div>
      </section>

      {/* Government Buses */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Government Bus Operators</h2>
            <p className="text-zinc-500">Official booking partner of most state transport corporations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {govBuses.map((gov, i) => (
              <Card key={i} className="group cursor-pointer hover:border-red-200 transition-colors">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <img src={gov.logo} alt={gov.name} className="h-16 object-contain mb-4 grayscale group-hover:grayscale-0 transition-all" />
                  <h3 className="font-bold mb-1">{gov.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    <Star className="h-3 w-3 fill-current" />
                    {gov.rating}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="rounded-full px-8">View All Gov Buses</Button>
          </div>
        </div>
      </section>

      {/* Why Redbus Section */}
      <section className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">Why book with RedBus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-zinc-500">We prioritize your safety with verified operators and secure payments.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-zinc-500">Our dedicated support team is available around the clock to assist you.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CreditCard className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Offers</h3>
              <p className="text-zinc-500">Get the best deals and discounts on your bus ticket bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-red-600" />
            FAQs related to Bus Tickets Booking
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-bold py-6">Can I track the location of my booked bus online?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed">
                Yes, most of our operators provide real-time bus tracking. You will receive a link to track your bus on your registered mobile number and email before the journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-bold py-6">What are the advantages of bus ticket booking with redBus?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed">
                redBus offers multiple advantages like choosing your preferred seat, bus tracking, safe & secure payments, and 24/7 customer support. You also get access to exclusive discounts and offers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-bold py-6">Do I need to create an account on redBus to book a ticket?</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed">
                No, you can book as a guest. However, creating an account helps you manage your bookings easily, get refund status, and access personalized offers.
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
