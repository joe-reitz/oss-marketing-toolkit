import Link from 'next/link'
import { CalendarDays, Image, LinkIcon, MessageSquare, ScanSearch, QrCode, Type, Mail } from 'lucide-react'
import { brandConfig } from '@/config/brand'

export default function Home() {
  const tools = [
    {
      href: '/utm-generator',
      icon: LinkIcon,
      title: 'UTM Generator',
      description: 'Create trackable campaign URLs with UTM parameters',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      href: '/image-generator',
      icon: Image,
      title: 'Image Generator',
      description: 'Create branded social media images and banners',
      color: 'from-purple-500 to-pink-500'
    },
    {
      href: '/qr-code-generator',
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Generate custom QR codes for campaigns',
      color: 'from-green-500 to-emerald-500'
    },
    {
      href: '/naming-generators',
      icon: Type,
      title: 'Naming Generators',
      description: 'Generate consistent campaign and asset names',
      color: 'from-orange-500 to-red-500'
    },
    {
      href: '/date-time-picker',
      icon: CalendarDays,
      title: 'Date & Time Picker',
      description: 'Pick dates and times across timezones',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      href: '/email-builder',
      icon: Mail,
      title: 'Email Builder',
      description: 'Build and design marketing emails',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      href: '/content-analyzer',
      icon: MessageSquare,
      title: 'Content Analyzer',
      description: 'Analyze and optimize marketing content',
      color: 'from-rose-500 to-pink-500'
    },
    {
      href: '/soql-query-helper',
      icon: ScanSearch,
      title: 'Data Tools',
      description: 'Format data for SOQL queries and conversions',
      color: 'from-violet-500 to-purple-500'
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {brandConfig.company.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Everything you need for marketing operations in one place.
              Generate UTMs, create branded images, build QR codes, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map(({ href, icon: Icon, title, description, color }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="space-y-3">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">{title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-colors pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Open source marketing toolkit. Customize and deploy your own.</p>
        </div>
      </div>
    </main>
  )
}