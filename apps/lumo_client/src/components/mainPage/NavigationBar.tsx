"use client"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, GraduationCap } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useTheme } from 'next-themes'
import { Sidebar } from './Sidebar'

type NavItem = {
  name: string
  href: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Documentation', href: 'https://github.com/ENDragnee/easy-learning' },
]

export function NavigationBar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure the router is accessed only after mounting
  const [currentPath, setCurrentPath] = useState<string | null>(null)

  const pathname = usePathname(); // Safely use this at the top

  useEffect(() => {
    setMounted(true);
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!mounted) {
    return null; // Prevents issues with SSR
  }

  return (
    <>
      <Sidebar />
      <nav className={cn(
        "fixed top-0 left-0 z-0 right-0 transition-colors duration-300",
        theme === 'dark' ? "bg-lumo-dark1 text-white" : "bg-white text-lumo-dark1"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <GraduationCap className="h-6 w-6" />
              </Link>
            </div>
            <div className="hidden md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                    currentPath === item.href
                      ? "border-b-2 border-lumo-accent"
                      : "hover:border-b-2 hover:border-lumo-accent"
                  )}
                >
                  {item.name}
                </Link>

              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className={cn(
                    "w-8 pl-8 pr-2 py-2 h-8 rounded-full transition-all duration-300 ease-in-out",
                    theme === 'dark' ? "bg-lumo-dark3 text-white" : "bg-gray-100 text-lumo-dark1",
                    isSearchExpanded ? "w-64" : "w-8"
                  )}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                />
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lumo-muted cursor-pointer"
                  onClick={() => setIsSearchExpanded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

