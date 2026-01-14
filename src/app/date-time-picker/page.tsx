"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, Copy, ChevronsUpDown, Sparkles, CalendarDays, Clock, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

type ErrorState = {
  [key: string]: string | null
}

// Helper function to format date with custom format string
const formatDate = (date: Date, format: string, timeZone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date)
  const partMap = parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value
      return acc
    },
    {} as Record<string, string>,
  )

  return format
    .replace("YYYY", partMap.year)
    .replace("MM", partMap.month)
    .replace("DD", partMap.day)
    .replace("HH", partMap.hour === "24" ? "00" : partMap.hour) // Handle midnight case
    .replace("mm", partMap.minute)
    .replace("ss", partMap.second)
}

// Prioritized US timezones
const usTimezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
]

export default function EventCreatorPage() {
  // --- STATE MANAGEMENT ---
  const [eventName, setEventName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState("10")
  const [minute, setMinute] = useState("00")
  const [ampm, setAmPm] = useState("AM")
  const [timezone, setTimezone] = useState("America/New_York")
  const [duration, setDuration] = useState("60")
  const [timezonePopoverOpen, setTimezonePopoverOpen] = useState(false)
  const [customFormat, setCustomFormat] = useState("YYYY-MM-DD HH:mm:ss")

  // SFDC Date/Time State
  const [sfdcDate, setSfdcDate] = useState<Date>()
  const [sfdcHour, setSfdcHour] = useState("10")
  const [sfdcMinute, setSfdcMinute] = useState("00")
  const [sfdcAmPm, setSfdcAmPm] = useState("AM")
  const [sfdcOutput, setSfdcOutput] = useState("")
  const [activeTab, setActiveTab] = useState("calendar")

  const [errors, setErrors] = useState<ErrorState>({})
  const [generatedOutput, setGeneratedOutput] = useState<{
    googleLink: string
    agicalLink: string
    isoStart: string
    isoEnd: string
    formattedDateTime: string
  } | null>(null)

  const [copied, setCopied] = useState<string | null>(null)

  // --- DATA & MEMOIZATION ---
  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone")
    } catch (_e) {
      // Fix: Changed e to _e to satisfy eslint rule
      // Fallback for older environments
      return ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo"]
    }
  }, [])

  const allTimezoneOptions = useMemo(() => {
    const usValues = new Set(usTimezones.map((tz) => tz.value))
    const otherTimezones = timezones
      .filter((tz) => !usValues.has(tz))
      .map((tz) => ({ value: tz, label: tz.replace(/_/g, " ") }))
    return [...usTimezones, ...otherTimezones]
  }, [timezones])

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), [])
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")), [])

  const isoStart = generatedOutput?.isoStart
  useEffect(() => {
    if (isoStart) {
      const newFormatted = formatDate(new Date(isoStart), customFormat, timezone)
      setGeneratedOutput((prev) => (prev ? { ...prev, formattedDateTime: newFormatted } : null))
    }
  }, [isoStart, customFormat, timezone]) // Fix: Corrected useEffect dependencies to prevent infinite loops and satisfy linter

  // --- CORE LOGIC ---
  const handleGenerate = () => {
    // 1. Validation
    const newErrors: ErrorState = {}
    if (!eventName) newErrors.eventName = "Event name is required."
    if (!date) newErrors.date = "Date is required."
    if (!timezone) newErrors.timezone = "Timezone is required."
    if (!duration || Number.parseInt(duration) <= 0) newErrors.duration = "Duration must be a positive number."

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setGeneratedOutput(null)
      return
    }

    // Add an explicit guard to satisfy TypeScript's static analysis
    if (!date) {
      // This case is handled by the validation above, but this check satisfies the compiler.
      return
    }

    // 2. Time Conversion
    let hour24 = Number.parseInt(hour)
    if (ampm === "PM" && hour24 < 12) {
      hour24 += 12
    } else if (ampm === "AM" && hour24 === 12) {
      hour24 = 0 // Midnight case
    }

    const dateString = date.toISOString().split("T")[0]
    const localDateTimeString = `${dateString}T${String(hour24).padStart(2, "0")}:${minute}:00`

    // This is the key part: get the correct offset for the selected date and timezone
    let startUtc: Date
    try {
      const tempDate = new Date(localDateTimeString)
      if (isNaN(tempDate.getTime())) {
        throw new Error("Invalid date created")
      }

      const timeZoneName = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset",
      }).format(tempDate)

      const offsetMatch = timeZoneName.match(/GMT([+-]\d{1,2}(?::\d{2})?)/)
      if (!offsetMatch) {
        // Fallback for environments that don't support longOffset well, treat as local
        console.warn("Could not determine timezone offset, treating as local time.")
        startUtc = new Date(localDateTimeString)
      } else {
        let offset = offsetMatch[1]
        if (!offset.includes(":")) {
          offset = `${offset}:00`
        }
        const isoStringWithOffset = `${localDateTimeString}${offset}`
        startUtc = new Date(isoStringWithOffset)
      }
    } catch (_e) {
      // Fix: Changed e to _e to satisfy eslint rule
      console.error("Date parsing error:", _e)
      setErrors({ date: "Could not parse the selected date and time. Please check your inputs." })
      return
    }

    if (isNaN(startUtc.getTime())) {
      setErrors({ date: "Could not create a valid UTC date. Please check your inputs." })
      return
    }

    const endUtc = new Date(startUtc.getTime() + Number.parseInt(duration) * 60 * 1000)

    // 3. Format for Links & Date/Time
    const toGoogleCalendarFormat = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z"
    const startUtcFormatted = toGoogleCalendarFormat(startUtc)
    const endUtcFormatted = toGoogleCalendarFormat(endUtc)

    const encodedEventName = encodeURIComponent(eventName)
    const encodedDescription = encodeURIComponent(description)

    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedEventName}&dates=${startUtcFormatted}/${endUtcFormatted}&details=${encodedDescription}&ctz=${timezone}`
    const agicalLink = `https://ics.agical.io/?startdt=${startUtcFormatted}&enddt=${endUtcFormatted}&subject=${encodedEventName}&description=${encodedDescription}`
    const formattedDateTime = formatDate(startUtc, customFormat, timezone)

    setGeneratedOutput({
      googleLink,
      agicalLink,
      isoStart: startUtc.toISOString(),
      isoEnd: endUtc.toISOString(),
      formattedDateTime,
    })
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const commonTimes = [
    { label: "9:00 AM", hour: "9", minute: "00", ampm: "AM" },
    { label: "10:00 AM", hour: "10", minute: "00", ampm: "AM" },
    { label: "12:00 PM", hour: "12", minute: "00", ampm: "PM" },
    { label: "2:00 PM", hour: "2", minute: "00", ampm: "PM" },
    { label: "5:00 PM", hour: "5", minute: "00", ampm: "PM" },
  ]

  const handleGenerateSfdc = () => {
    if (!sfdcDate) {
      setSfdcOutput("Please select a date")
      return
    }

    // Convert 12-hour to 24-hour format
    let hour24 = Number.parseInt(sfdcHour)
    if (sfdcAmPm === "PM" && hour24 < 12) {
      hour24 += 12
    } else if (sfdcAmPm === "AM" && hour24 === 12) {
      hour24 = 0
    }

    // Format: YYYY-MM-DDTHH:MM:SSZ
    const year = sfdcDate.getFullYear()
    const month = String(sfdcDate.getMonth() + 1).padStart(2, "0")
    const day = String(sfdcDate.getDate()).padStart(2, "0")
    const hourStr = String(hour24).padStart(2, "0")
    const minuteStr = sfdcMinute.padStart(2, "0")
    
    const formatted = `${year}-${month}-${day}T${hourStr}:${minuteStr}:00Z`
    setSfdcOutput(formatted)
  }

  // --- RENDER ---
  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Date & Time Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate SFDC date/time formats or calendar event links with timezone support
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white gap-2"
              >
                <Globe className="h-4 w-4" />
                Calendar Event
              </TabsTrigger>
              <TabsTrigger
                value="sfdc"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white gap-2"
              >
                <Clock className="h-4 w-4" />
                SFDC Date/Time
              </TabsTrigger>
            </TabsList>

            {/* SFDC Date/Time Tab */}
            <TabsContent value="sfdc" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sfdc-date" className="text-base font-semibold">Date</Label>
                  <Input
                    id="sfdc-date"
                    type="date"
                    value={sfdcDate ? sfdcDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [year, month, day] = e.target.value.split('-').map(Number)
                        setSfdcDate(new Date(year, month - 1, day))
                      } else {
                        setSfdcDate(undefined)
                      }
                    }}
                    className="h-11"
                  />
                </div>

                {/* Quick Time Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Quick Time</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {commonTimes.map((time) => (
                      <Button
                        key={time.label}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSfdcHour(time.hour)
                          setSfdcMinute(time.minute)
                          setSfdcAmPm(time.ampm)
                        }}
                        className={cn(
                          "h-9",
                          sfdcHour === time.hour && sfdcMinute === time.minute && sfdcAmPm === time.ampm &&
                            "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                        )}
                      >
                        {time.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="sfdc-hour" className="text-sm font-semibold">Hour</Label>
                    <Select value={sfdcHour} onValueChange={setSfdcHour}>
                      <SelectTrigger id="sfdc-hour" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sfdc-minute" className="text-sm font-semibold">Minute</Label>
                    <Select value={sfdcMinute} onValueChange={setSfdcMinute}>
                      <SelectTrigger id="sfdc-minute" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sfdc-ampm" className="text-sm font-semibold">AM/PM</Label>
                    <Select value={sfdcAmPm} onValueChange={setSfdcAmPm}>
                      <SelectTrigger id="sfdc-ampm" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateSfdc}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate SFDC Format
                </Button>

                {sfdcOutput && (
                  <div className="p-4 rounded-lg border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 space-y-3">
                    <Label className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">SFDC Date/Time Format</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={sfdcOutput}
                        className="font-mono text-base font-semibold bg-background"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(sfdcOutput, "sfdc")}
                      >
                        {copied === "sfdc" ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Format: YYYY-MM-DDTHH:MM:SSZ</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Calendar Event Tab */}
            <TabsContent value="calendar" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Event Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name" className="text-base font-semibold">Event Name</Label>
                    <Input
                      id="event-name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="h-11"
                      placeholder="Marketing Team Summit 2026"
                    />
                    {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-semibold">Description <span className="text-muted-foreground font-normal text-sm">(optional)</span></Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Event details, venue information, links..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Column 2: Time & Date Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base font-semibold">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date ? date.toISOString().split("T")[0] : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [year, month, day] = e.target.value.split('-').map(Number)
                          setDate(new Date(year, month - 1, day))
                        } else {
                          setDate(undefined)
                        }
                      }}
                      className="h-11"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  {/* Quick Time Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Quick Time</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {commonTimes.map((time) => (
                        <Button
                          key={time.label}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setHour(time.hour)
                            setMinute(time.minute)
                            setAmPm(time.ampm)
                          }}
                          className={cn(
                            "h-9",
                            hour === time.hour && minute === time.minute && ampm === time.ampm &&
                              "border-teal-500 bg-teal-50 dark:bg-teal-950/20"
                          )}
                        >
                          {time.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="hour" className="text-sm font-semibold">Hour</Label>
                      <Select value={hour} onValueChange={setHour}>
                        <SelectTrigger id="hour" className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minute" className="text-sm font-semibold">Minute</Label>
                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger id="minute" className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ampm" className="text-sm font-semibold">AM/PM</Label>
                      <Select value={ampm} onValueChange={setAmPm}>
                        <SelectTrigger id="ampm" className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm font-semibold">Timezone</Label>
                      <Popover open={timezonePopoverOpen} onOpenChange={setTimezonePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={timezonePopoverOpen}
                            className="w-full justify-between h-11"
                          >
                            <span className="truncate">
                              {timezone
                                ? allTimezoneOptions.find((tz) => tz.value === timezone)?.label
                                : "Select timezone..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search timezone..." />
                            <CommandList>
                              <CommandEmpty>No timezone found.</CommandEmpty>
                              <CommandGroup heading="Common">
                                {usTimezones.map((tz) => (
                                  <CommandItem
                                    key={tz.value}
                                    value={tz.value}
                                    onSelect={(currentValue) => {
                                      setTimezone(currentValue === timezone ? "" : currentValue)
                                      setTimezonePopoverOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn("mr-2 h-4 w-4", timezone === tz.value ? "opacity-100" : "opacity-0")}
                                    />
                                    {tz.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandGroup heading="All Timezones">
                                {allTimezoneOptions
                                  .filter((tz) => !usTimezones.find((usTz) => usTz.value === tz.value))
                                  .map((tz) => (
                                    <CommandItem
                                      key={tz.value}
                                      value={tz.value}
                                      onSelect={(currentValue) => {
                                        setTimezone(currentValue === timezone ? "" : currentValue)
                                        setTimezonePopoverOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={cn("mr-2 h-4 w-4", timezone === tz.value ? "opacity-100" : "opacity-0")}
                                      />
                                      {tz.label}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {errors.timezone && <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-semibold">Duration (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="h-11"
                        min="1"
                        placeholder="60"
                      />
                      {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate Calendar Links
                </Button>
              </div>

              {generatedOutput && (
                <div className="mt-8">
                  <Tabs defaultValue="agical" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="agical">
                        Agical Link
                      </TabsTrigger>
                      <TabsTrigger value="google">
                        Google Calendar
                      </TabsTrigger>
                      <TabsTrigger value="datetime">
                        Custom Format
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="agical" className="mt-4 p-4 rounded-lg border-2 border-teal-500 bg-teal-50 dark:bg-teal-950/20">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-teal-700 dark:text-teal-300">Agical Calendar Link (.ics download)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={generatedOutput.agicalLink}
                            className="font-mono text-sm bg-background"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(generatedOutput.agicalLink, "agical")}
                          >
                            {copied === "agical" ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Click this link to download a .ics file that works with all calendar apps</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="google" className="mt-4 p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Google Calendar Link</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={generatedOutput.googleLink}
                            className="font-mono text-sm bg-background"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(generatedOutput.googleLink, "google")}
                          >
                            {copied === "google" ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Opens Google Calendar with pre-filled event details</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="datetime" className="mt-4 p-4 rounded-lg border-2 border-violet-500 bg-violet-50 dark:bg-violet-950/20">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="custom-format" className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                            Custom Format String
                          </Label>
                          <Input
                            id="custom-format"
                            value={customFormat}
                            onChange={(e) => setCustomFormat(e.target.value)}
                            className="mt-1 font-mono bg-background"
                            placeholder="YYYY-MM-DD HH:mm:ss"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Use: YYYY, MM, DD, HH, mm, ss</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-violet-700 dark:text-violet-300">Formatted Output</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              readOnly
                              value={generatedOutput.formattedDateTime}
                              className="font-mono text-base font-semibold bg-background"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(generatedOutput.formattedDateTime, "datetime")}
                            >
                              {copied === "datetime" ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <Copy className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
