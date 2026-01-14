'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Download, Image as ImageIcon, Upload } from "lucide-react"
import { brandConfig } from '@/config/brand'

const IMAGE_FORMATS = {
  'og': { width: 1200, height: 630, label: 'Open Graph (1200×630)' },
  'youtube': { width: 1280, height: 720, label: 'YouTube Thumbnail (1280×720)' },
  'twitter': { width: 1200, height: 675, label: 'Twitter Card (1200×675)' },
  'email-small': { width: 1200, height: 400, label: 'Email Banner Small (1200×400 @2x)' },
  'email-large': { width: 1200, height: 800, label: 'Email Banner Large (1200×800 @2x)' },
  'banner': { width: 2048, height: 400, label: 'Wide Banner (2048×400)' },
}

type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type FontStyle = 'regular' | 'bold' | 'bold italic'
type LogoType = 'logotype' | 'icon'

export default function ImageGenerator() {
  const [text, setText] = useState('Welcome to Marketing Toolkit')
  const [format, setFormat] = useState('og')
  const [textPosition, setTextPosition] = useState<Position>('middle-center')
  const [fontStyle, setFontStyle] = useState<FontStyle>('bold')
  const [logoPosition, setLogoPosition] = useState<Position>('bottom-right')
  const [logoType, setLogoType] = useState<LogoType>('icon')
  const [showLogo, setShowLogo] = useState(true)
  const [logoSize, setLogoSize] = useState(20)
  const [textSize, setTextSize] = useState(12)
  const [backgroundId, setBackgroundId] = useState('gradient-purple')
  const [textColor, setTextColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logo, setLogo] = useState<HTMLImageElement | null>(null)
  const [customBgImage, setCustomBgImage] = useState<HTMLImageElement | null>(null)
  const [blurBackground, setBlurBackground] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const background = brandConfig.imageBackgrounds.find(bg => bg.id === backgroundId)
  const isLightBackground = backgroundId === 'solid-white'

  useEffect(() => {
    if (!showLogo) return

    const loadImage = () => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      const logoPath = logoType === 'icon'
        ? (isLightBackground ? brandConfig.logo.icon.dark : brandConfig.logo.icon.light)
        : (isLightBackground ? brandConfig.logo.logotype.dark : brandConfig.logo.logotype.light)

      img.src = logoPath
      img.onload = () => setLogo(img)
      img.onerror = () => {
        console.log('Logo not found, continuing without logo')
        setLogo(null)
      }
    }
    loadImage()
  }, [logoType, isLightBackground, showLogo])

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = IMAGE_FORMATS[format as keyof typeof IMAGE_FORMATS]
    canvas.width = width
    canvas.height = height

    // Draw background
    if (backgroundId === 'custom' && customBgImage) {
      // Draw custom background image
      const imgAspect = customBgImage.width / customBgImage.height
      const canvasAspect = width / height
      let drawWidth, drawHeight, offsetX, offsetY

      // Cover the entire canvas
      if (imgAspect > canvasAspect) {
        drawHeight = height
        drawWidth = height * imgAspect
        offsetX = (width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = width
        drawHeight = width / imgAspect
        offsetX = 0
        offsetY = (height - drawHeight) / 2
      }

      // Apply blur if enabled
      if (blurBackground) {
        ctx.filter = 'blur(20px)'
      }

      ctx.drawImage(customBgImage, offsetX, offsetY, drawWidth, drawHeight)

      // Reset filter
      if (blurBackground) {
        ctx.filter = 'none'
      }
    } else if (background?.gradient.startsWith('linear-gradient')) {
      // Parse gradient
      const gradientMatch = background.gradient.match(/linear-gradient\((\d+)deg,\s*(.+?)\s+(\d+%),\s*(.+?)\s+(\d+%)\)/)
      if (gradientMatch) {
        const angle = parseInt(gradientMatch[1])
        const color1 = gradientMatch[2]
        const color2 = gradientMatch[4]

        const angleRad = (angle - 90) * Math.PI / 180
        const x1 = width / 2 + Math.cos(angleRad) * width / 2
        const y1 = height / 2 + Math.sin(angleRad) * height / 2
        const x2 = width / 2 - Math.cos(angleRad) * width / 2
        const y2 = height / 2 - Math.sin(angleRad) * height / 2

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, color1)
        gradient.addColorStop(1, color2)
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = '#667eea'
      }
      ctx.fillRect(0, 0, width, height)
    } else {
      ctx.fillStyle = background?.gradient || '#667eea'
      ctx.fillRect(0, 0, width, height)
    }

    // Draw logo
    if (logo && showLogo) {
      const logoHeight = Math.min(height * (logoSize / 100), height * 0.4)
      const logoWidth = (logoHeight / logo.height) * logo.width
      const [logoX, logoY] = getPosition(logoPosition, width, height, logoWidth, logoHeight)
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
    }

    // Draw text
    if (text) {
      ctx.fillStyle = textColor
      ctx.textBaseline = 'top'

      const fontWeight = fontStyle.includes('bold') ? '700' : '400'
      const fontStyleText = fontStyle.includes('italic') ? 'italic' : 'normal'
      const fontSize = Math.floor(height * (textSize / 100))
      ctx.font = `${fontStyleText} ${fontWeight} ${fontSize}px "Geist", -apple-system, sans-serif`

      const padding = Math.floor(width / 20)
      const maxWidth = width - (padding * 2)
      const words = text.split(' ')
      const lines = []
      let currentLine = words[0] || ''

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      const lineHeight = fontSize * 1.3
      const totalTextHeight = lines.length * lineHeight

      let textX: number
      let textY: number

      // Horizontal alignment
      switch (textPosition.split('-')[1]) {
        case 'left':
          textX = padding
          ctx.textAlign = 'left'
          break
        case 'center':
          textX = width / 2
          ctx.textAlign = 'center'
          break
        case 'right':
          textX = width - padding
          ctx.textAlign = 'right'
          break
        default:
          textX = width / 2
          ctx.textAlign = 'center'
      }

      // Vertical alignment
      switch (textPosition.split('-')[0]) {
        case 'top':
          textY = padding
          break
        case 'middle':
          textY = (height - totalTextHeight) / 2
          break
        case 'bottom':
          textY = height - totalTextHeight - padding
          break
        default:
          textY = (height - totalTextHeight) / 2
      }

      lines.forEach((line, index) => {
        ctx.fillText(line, textX, textY + index * lineHeight)
      })
    }
  }, [text, format, logo, textPosition, fontStyle, logoPosition, logoSize, textSize, background, textColor, showLogo, backgroundId, customBgImage, blurBackground])

  useEffect(() => {
    if (canvasRef.current) {
      drawImage()
    }
  }, [drawImage])

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const link = document.createElement('a')
      link.download = `marketing-image-${format}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error("Failed to export image:", error)
      alert("Failed to export image. Please try again.")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setCustomBgImage(img)
          setBackgroundId('custom')
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const getPosition = (position: Position, width: number, height: number, elementWidth: number, elementHeight: number): [number, number] => {
    const padding = Math.floor(width / 20)
    let x: number, y: number

    const [vertical, horizontal] = position.split('-')

    // Horizontal position
    switch (horizontal) {
      case 'left':
        x = padding
        break
      case 'center':
        x = (width - elementWidth) / 2
        break
      case 'right':
        x = width - elementWidth - padding
        break
      default:
        x = padding
    }

    // Vertical position
    switch (vertical) {
      case 'top':
        y = padding
        break
      case 'middle':
        y = (height - elementHeight) / 2
        break
      case 'bottom':
        y = height - elementHeight - padding
        break
      default:
        y = padding
    }

    return [x, y]
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Image Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Create branded social media images, banners, and marketing graphics
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-semibold">Text Content</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here"
                className="text-base"
              />
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Image Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(IMAGE_FORMATS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Background Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Background</Label>
              <RadioGroup value={backgroundId} onValueChange={setBackgroundId} className="grid grid-cols-2 gap-2">
                {brandConfig.imageBackgrounds.map((bg) => (
                  <div key={bg.id}>
                    <RadioGroupItem value={bg.id} id={bg.id} className="peer sr-only" />
                    <Label
                      htmlFor={bg.id}
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors h-20"
                    >
                      <div
                        className="w-full h-8 rounded mb-1"
                        style={{ background: bg.gradient }}
                      />
                      <span className="text-xs font-medium">{bg.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Custom Background Upload */}
              <div className="pt-2 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Custom Background
                </Button>

                {backgroundId === 'custom' && customBgImage && (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <Label
                      htmlFor="blur-bg"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Blur background image
                    </Label>
                    <Switch
                      id="blur-bg"
                      checked={blurBackground}
                      onCheckedChange={setBlurBackground}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Text Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Text Position</Label>
                <Select value={textPosition} onValueChange={(v) => setTextPosition(v as Position)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Font Style</Label>
                <Select value={fontStyle} onValueChange={(v) => setFontStyle(v as FontStyle)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="bold italic">Bold Italic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Text Size: {textSize}%</Label>
              <Slider
                min={5}
                max={25}
                step={1}
                value={[textSize]}
                onValueChange={(v) => setTextSize(v[0])}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Logo Settings */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Logo Settings</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogo(!showLogo)}
                >
                  {showLogo ? 'Hide Logo' : 'Show Logo'}
                </Button>
              </div>

              {showLogo && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Logo Type</Label>
                      <Select value={logoType} onValueChange={(v) => setLogoType(v as LogoType)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="icon">Icon Only</SelectItem>
                          <SelectItem value="logotype">Full Logotype</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Logo Position</Label>
                      <Select value={logoPosition} onValueChange={(v) => setLogoPosition(v as Position)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Logo Size: {logoSize}%</Label>
                    <Slider
                      min={5}
                      max={50}
                      step={1}
                      value={[logoSize]}
                      onValueChange={(v) => setLogoSize(v[0])}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Preview & Export */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
            <Label className="text-base font-semibold">Preview</Label>
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <Button onClick={handleExport} className="w-full h-12 text-base font-semibold gap-2">
              <Download className="h-5 w-5" />
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}