'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Copy, Check, Database, Sparkles } from 'lucide-react'

export default function DataToolsPage() {
  // SOQL Query Helper State
  const [soqlInput, setSoqlInput] = useState('')
  const [soqlOutput, setSoqlOutput] = useState('')
  const [soqlCopied, setSoqlCopied] = useState(false)

  // Comma Separator State
  const [separatorInput, setSeparatorInput] = useState('')
  const [separatorOutput, setSeparatorOutput] = useState('')
  const [separatorCopied, setSeparatorCopied] = useState(false)

  const [activeTab, setActiveTab] = useState('soql')

  const handleSoqlFormat = () => {
    const inputArray = soqlInput.split(/\r?\n/).filter(item => item.trim() !== '')
    const formattedOutput = inputArray.length ? `'${inputArray.join("','")}'` : ''
    setSoqlOutput(formattedOutput)
  }

  const handleCommaSeparate = () => {
    // Split by newlines, tabs, or multiple spaces (common in spreadsheet pastes)
    const inputArray = separatorInput
      .split(/[\n\r\t]+/)
      .map(item => item.trim())
      .filter(item => item !== '')
    const formattedOutput = inputArray.join(', ')
    setSeparatorOutput(formattedOutput)
  }

  const copySoqlToClipboard = () => {
    navigator.clipboard.writeText(soqlOutput).then(() => {
      setSoqlCopied(true)
      setTimeout(() => setSoqlCopied(false), 2000)
    })
  }

  const copySeparatorToClipboard = () => {
    navigator.clipboard.writeText(separatorOutput).then(() => {
      setSeparatorCopied(true)
      setTimeout(() => setSeparatorCopied(false), 2000)
    })
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Data Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Format data for SOQL queries or convert spreadsheet data to comma-separated values
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger
                value="soql"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white gap-2"
              >
                <Database className="h-4 w-4" />
                SOQL Query Helper
              </TabsTrigger>
              <TabsTrigger
                value="separator"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Comma Separator
              </TabsTrigger>
            </TabsList>

            {/* SOQL Query Helper Tab */}
            <TabsContent value="soql" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="soql-input" className="text-base font-semibold">
                  Input (one value per line)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enter account IDs, email addresses, or any values you need in a SOQL query
                </p>
                <Textarea
                  id="soql-input"
                  placeholder="value1&#10;value2&#10;value3"
                  value={soqlInput}
                  onChange={(e) => setSoqlInput(e.target.value)}
                  rows={12}
                  className="font-mono resize-none"
                />
              </div>

              <Button
                onClick={handleSoqlFormat}
                className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold gap-2"
                disabled={!soqlInput.trim()}
              >
                <Sparkles className="h-5 w-5" />
                Format for SOQL
              </Button>

              {soqlOutput && (
                <div className="p-4 rounded-lg border-2 border-violet-500 bg-violet-50 dark:bg-violet-950/20 space-y-3">
                  <Label htmlFor="soql-output" className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                    SOQL Formatted Output
                  </Label>
                  <Textarea
                    id="soql-output"
                    value={soqlOutput}
                    readOnly
                    rows={6}
                    className="font-mono resize-none bg-background"
                  />
                  <Button
                    onClick={copySoqlToClipboard}
                    variant="ghost"
                    className="w-full gap-2"
                  >
                    {soqlCopied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Comma Separator Tab */}
            <TabsContent value="separator" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="separator-input" className="text-base font-semibold">
                  Input (paste from spreadsheet)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Paste values from Excel, Google Sheets, or any tab/newline separated data
                </p>
                <Textarea
                  id="separator-input"
                  placeholder="Paste your spreadsheet values here...&#10;Each value on a new line or tab-separated"
                  value={separatorInput}
                  onChange={(e) => setSeparatorInput(e.target.value)}
                  rows={12}
                  className="font-mono resize-none"
                />
              </div>

              <Button
                onClick={handleCommaSeparate}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold gap-2"
                disabled={!separatorInput.trim()}
              >
                <Sparkles className="h-5 w-5" />
                Convert to Comma-Separated
              </Button>

              {separatorOutput && (
                <div className="p-4 rounded-lg border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/20 space-y-3">
                  <Label htmlFor="separator-output" className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                    Comma-Separated Output
                  </Label>
                  <Textarea
                    id="separator-output"
                    value={separatorOutput}
                    readOnly
                    rows={6}
                    className="font-mono resize-none bg-background"
                  />
                  <Button
                    onClick={copySeparatorToClipboard}
                    variant="ghost"
                    className="w-full gap-2"
                  >
                    {separatorCopied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

