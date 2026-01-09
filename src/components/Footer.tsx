import Link from "next/link"
import { Bus, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const sections = [
    {
      title: "About RedBus",
      links: [
        { label: "About us", href: "#" },
        { label: "Investor Relations", href: "#" },
        { label: "Contact us", href: "#" },
        { label: "Mobile version", href: "#" },
        { label: "redBus on mobile", href: "#" },
        { label: "Sitemap", href: "#" },
        { label: "Offers", href: "#" },
        { label: "Careers", href: "#" },
      ]
    },
    {
      title: "Info",
      links: [
        { label: "T&C", href: "#" },
        { label: "Privacy policy", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Bus operator registration", href: "#" },
        { label: "Agent registration", href: "#" },
        { label: "Insurance partner", href: "#" },
        { label: "User agreement", href: "#" },
      ]
    },
    {
      title: "Global Sites",
      links: [
        { label: "India", href: "#" },
        { label: "Singapore", href: "#" },
        { label: "Malaysia", href: "#" },
        { label: "Indonesia", href: "#" },
        { label: "Peru", href: "#" },
        { label: "Colombia", href: "#" },
        { label: "Cambodia", href: "#" },
        { label: "Vietnam", href: "#" },
      ]
    },
    {
      title: "Our Partners",
      links: [
        { label: "Goibibo Bus", href: "#" },
        { label: "Goibibo Hotels", href: "#" },
        { label: "Makemytrip Hotels", href: "#" },
      ]
    }
  ]

  return (
    <footer className="bg-zinc-100 py-16 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="rounded-lg bg-red-600 p-1.5 shadow-lg shadow-red-200">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-red-600">RedBus</span>
            </Link>
            <p className="text-sm text-zinc-500 mb-6">
              redBus is the world's largest online bus ticket booking service trusted by over 25 million happy customers globally. redBus offers bus ticket booking through its website, iOS and Android mobile apps for all major routes.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-zinc-400 hover:text-red-600 cursor-pointer" />
              <Twitter className="h-5 w-5 text-zinc-400 hover:text-red-600 cursor-pointer" />
              <Instagram className="h-5 w-5 text-zinc-400 hover:text-red-600 cursor-pointer" />
              <Youtube className="h-5 w-5 text-zinc-400 hover:text-red-600 cursor-pointer" />
            </div>
          </div>
          
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-zinc-900 dark:text-zinc-100">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-red-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            Ⓒ 2024 Redbus India Pvt Ltd. All rights reserved
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-zinc-500 hover:text-red-600 cursor-pointer">Terms of Use</span>
            <span className="text-sm text-zinc-500 hover:text-red-600 cursor-pointer">Privacy Policy</span>
            <span className="text-sm text-zinc-500 hover:text-red-600 cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
