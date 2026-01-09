"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { CreditCard, ShieldCheck, Ticket, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const busId = searchParams.get("busId")
  const seats = searchParams.get("seats")?.split(",") || []
  const total = searchParams.get("total")

  const [bus, setBus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function fetchBus() {
      if (!busId) return
      const { data, error } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single()
      
      if (data) setBus(data)
      setLoading(false)
    }
    fetchBus()
  }, [busId])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)

    // Simulate booking creation
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from("bookings")
      .insert({
        bus_id: busId,
        user_id: user?.id || null, // Allow guest for demo, though real app would require auth
        seat_numbers: seats,
        total_price: parseFloat(total || "0"),
        status: "confirmed"
      })

    if (error) {
      toast.error("Booking failed. Please try again.")
    } else {
      toast.success("Booking successful!")
      router.push("/bookings")
    }
    setBookingLoading(false)
  }

  if (loading) return <div className="p-20 text-center">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-6 text-2xl font-bold">Passenger Details</h2>
            <Card>
              <CardContent className="p-6">
                <form id="booking-form" onSubmit={handleBooking} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">Payment Method</h2>
            <Card className="border-2 border-red-100 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-red-600 p-2 text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Pay at Bus / Online</p>
                  <p className="text-sm text-zinc-500">Secure payment options will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Your booking is protected by RedBus Safe Travel Guarantee
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-red-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold">{bus?.name}</h3>
                <p className="text-sm text-zinc-500">{bus?.type}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <span>{bus?.source}</span>
                  <span className="text-zinc-400">→</span>
                  <span>{bus?.destination}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Seats Selected</span>
                  <div className="flex gap-1">
                    {seats.map(s => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Base Fare ({seats.length} × ₹{bus?.price})</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Taxes & Fees</span>
                  <span>₹0</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-red-600">₹{total}</span>
              </div>

              <Button 
                form="booking-form"
                type="submit"
                className="h-14 w-full bg-red-600 text-lg font-bold hover:bg-red-700"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Processing..." : "CONFIRM BOOKING"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
