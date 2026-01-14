"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const utmSources = [
  "facebook", "twitter", "instagram", "google", "linkedin", "youtube",
  "reddit", "discord", "tiktok", "pinterest", "carbon", "outreach",
  "dailydev", "partner", "sponsor", "event", "newsletter", "blog",
  "qrcode", "email", "website", "organic", "referral", "direct", "map"
]

const utmMediums = [
  "cpc", "email", "display", "social", "print", "video", "affiliate",
  "referral", "organic", "paid", "web", "newsletter", "blog", "ebook"
]

const commonGroupings = [
  { medium: "social", source: "facebook", label: "Facebook Social" },
  { medium: "social", source: "twitter", label: "Twitter/X Social" },
  { medium: "social", source: "linkedin", label: "LinkedIn Social" },
  { medium: "cpc", source: "google", label: "Google Ads" },
  { medium: "email", source: "newsletter", label: "Email Newsletter" },
  { medium: "referral", source: "partner", label: "Partner Referral" },
]

export default function UTMGenerator() {
  const [baseUrl, setBaseUrl] = useState("")
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmContent, setUtmContent] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [queryString, setQueryString] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isQueryCopied, setIsQueryCopied] = useState(false)
  const { toast } = useToast()

  const generateUrl = () => {
    if (!baseUrl.match(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/)) {
      toast({
        title: "Invalid base URL",
        description: "Please enter a valid domain and path.",
        variant: "destructive",
      })
      setGeneratedUrl("")
      setQueryString("")
      return
    }

    const params = new URLSearchParams({
      utm_medium: utmMedium,
      utm_source: utmSource,
      utm_campaign: utmCampaign
    })

    // Add optional parameters only if they have values
    if (utmContent.trim()) {
      params.append('utm_content', utmContent.trim())
    }
    if (utmTerm.trim()) {
      params.append('utm_term', utmTerm.trim())
    }

    const queryStr = `?${params.toString()}`
    const url = `https://${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`
    setGeneratedUrl(url)
    setQueryString(queryStr)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl)
    setIsCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The full UTM URL has been copied to your clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleCopyQueryString = () => {
    navigator.clipboard.writeText(queryString)
    setIsQueryCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The query string has been copied to your clipboard.",
    })
    setTimeout(() => setIsQueryCopied(false), 2000)
  }

  const handleGroupingSelect = (medium: string, source: string) => {
    setUtmMedium(medium)
    setUtmSource(source)
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <LinkIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">UTM Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Create trackable campaign URLs with UTM parameters for analytics
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
        {/* Base URL */}
        <div className="space-y-2">
          <Label htmlFor="baseUrl" className="text-base font-semibold">Base URL</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm bg-muted border border-r-0 border-input rounded-l-md">
              https://
            </span>
            <Input
              id="baseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="example.com/page"
              className="rounded-l-none"
            />
          </div>
        </div>

        {/* Common Groupings */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Quick Presets</Label>
          <p className="text-sm text-muted-foreground">Select a common source/medium combination</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonGroupings.map((group) => (
              <Button
                key={`${group.source}-${group.medium}`}
                variant="outline"
                className={`justify-start ${
                  utmMedium === group.medium && utmSource === group.source
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
                onClick={() => handleGroupingSelect(group.medium, group.source)}
              >
                {group.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t pt-6 grid md:grid-cols-2 gap-6">
          {/* UTM Medium */}
          <div className="space-y-2">
            <Label htmlFor="utmMedium" className="text-base font-semibold">UTM Medium</Label>
            <p className="text-sm text-muted-foreground">Marketing channel</p>
            <Select value={utmMedium} onValueChange={setUtmMedium}>
              <SelectTrigger>
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                {utmMediums.map((medium) => (
                  <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UTM Source */}
          <div className="space-y-2">
            <Label htmlFor="utmSource" className="text-base font-semibold">UTM Source</Label>
            <p className="text-sm text-muted-foreground">Traffic source</p>
            <Select value={utmSource} onValueChange={setUtmSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {utmSources.map((source) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* UTM Campaign */}
        <div className="space-y-2">
          <Label htmlFor="utmCampaign" className="text-base font-semibold">UTM Campaign</Label>
          <p className="text-sm text-muted-foreground">Campaign name or identifier</p>
          <Input
            id="utmCampaign"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            placeholder="summer-sale-2024"
          />
        </div>

        {/* Optional Parameters */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-muted-foreground">Optional Parameters</Label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* UTM Content */}
            <div className="space-y-2">
              <Label htmlFor="utmContent" className="text-sm font-semibold">UTM Content <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <p className="text-xs text-muted-foreground">Differentiate similar content or links</p>
              <Input
                id="utmContent"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="header-cta"
              />
            </div>

            {/* UTM Term */}
            <div className="space-y-2">
              <Label htmlFor="utmTerm" className="text-sm font-semibold">UTM Term <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <p className="text-xs text-muted-foreground">Paid search keywords</p>
              <Input
                id="utmTerm"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="marketing+toolkit"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateUrl}
          className="w-full h-12 text-base font-semibold"
          disabled={!baseUrl || !utmMedium || !utmSource || !utmCampaign}
        >
          Generate UTM URL
        </Button>

        {/* Generated URL */}
        {generatedUrl && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Full URL</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Full URL
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm font-mono break-all p-3 bg-background rounded border">
                {generatedUrl}
              </p>
            </div>

            <div className="p-4 rounded-lg border-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Query String Only</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyQueryString}
                  className="gap-2"
                >
                  {isQueryCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Query String
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm font-mono break-all p-3 bg-background rounded border">
                {queryString}
              </p>
              <p className="text-xs text-muted-foreground">
                Use this to append UTM parameters to any URL
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}