"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bus, User, LogIn, LogOut, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-red-600 p-1.5 shadow-lg shadow-red-200">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-red-600">RedBus</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex ml-8">
            <Link href="/" className="flex flex-col items-center gap-1 group">
              <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                <Bus className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-xs font-bold text-zinc-900">Bus Tickets</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 group opacity-60 hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors">
                <Ticket className="h-5 w-5 text-zinc-600" />
              </div>
              <span className="text-xs font-bold text-zinc-900">Train Tickets</span>
            </Link>
          </div>
          
          <div className="flex flex-1 items-center justify-end gap-4">

          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/bookings">My Bookings</Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-red-100 text-red-600 font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-zinc-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookings" className="cursor-pointer flex items-center">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" asChild>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
