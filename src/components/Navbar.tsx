"use client"

import Link from "next/link"
import { Bus, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-red-600 p-1.5">
            <Bus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-red-600">RedBus</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/bookings">My Bookings</Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/auth/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
