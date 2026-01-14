'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Download, Sparkles } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('https://example.com')
  const [size, setSize] = useState(256)

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <QrCode className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">QR Code Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate QR codes for URLs, campaigns, and marketing materials
        </p>
      </div>

      {/* Main Card */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <Card className="border-2">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-base font-semibold">URL or Text</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL, text, or any content you want to encode
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="size" className="text-sm font-semibold">QR Code Size: {size}px</Label>
              </div>
              <Slider
                id="size"
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                min={128}
                max={512}
                step={32}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>128px</span>
                <span>512px</span>
              </div>
            </div>

            <Button
              onClick={() => {
                const svg = document.querySelector('#qr-code-svg')
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg)
                  const canvas = document.createElement('canvas')
                  const ctx = canvas.getContext('2d')
                  const img = new Image()
                  img.onload = () => {
                    canvas.width = size
                    canvas.height = size
                    ctx?.drawImage(img, 0, 0)
                    const pngFile = canvas.toDataURL('image/png')
                    const downloadLink = document.createElement('a')
                    downloadLink.download = `qr-code-${Date.now()}.png`
                    downloadLink.href = pngFile
                    downloadLink.click()
                  }
                  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
                }
              }}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold gap-2"
            >
              <Download className="h-5 w-5" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardContent className="pt-6 space-y-4">
              <Label className="text-base font-semibold">Preview</Label>
              <div className="flex justify-center items-center p-8 bg-muted rounded-lg min-h-[400px]">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-full">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={url}
                    size={Math.min(size, 400)}
                    level="H"
                    includeMargin={false}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan with your phone camera to test
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}