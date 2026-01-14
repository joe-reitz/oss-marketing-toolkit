"use client"

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './theme-toggle'
import { brandConfig } from '@/config/brand'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/naming-generators', label: 'Naming Generators' },
    { href: '/date-time-picker', label: 'Date & Time' },
    { href: '/utm-generator', label: 'UTM Generator' },
    { href: '/image-generator', label: 'Image Generator' },
    { href: '/qr-code-generator', label: 'QR Code' },
    { href: '/content-analyzer', label: 'Content Analyzer' },
    { href: '/soql-query-helper', label: 'Data Tools' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg hover:opacity-80 transition-opacity">
            <span className="text-2xl">{brandConfig.logo.fallback}</span>
            <span className="hidden sm:inline">{brandConfig.company.name}</span>
            <span className="sm:hidden">{brandConfig.company.shortName}</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side - Theme toggle + Mobile menu button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}