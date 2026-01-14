"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Copy, Check, AlertCircle, Maximize2, MessageSquare } from "lucide-react"

const contentTypes = [
  { value: "email", label: "Email" },
  { value: "webpage", label: "Webpage Copy" },
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Post" },
  { value: "ad", label: "Ad Copy" },
  { value: "product", label: "Product Description" },
  { value: "docs", label: "Documentation" },
]

export default function ContentAnalyzerPage() {
  const [inputContent, setInputContent] = useState("")
  const [contentType, setContentType] = useState("")
  const [outputContent, setOutputContent] = useState("")
  const [improvements, setImprovements] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // Email-specific fields
  const [emailSubject, setEmailSubject] = useState("")
  const [emailPreheader, setEmailPreheader] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailOutputSubject, setEmailOutputSubject] = useState("")
  const [emailOutputPreheader, setEmailOutputPreheader] = useState("")
  const [emailOutputBody, setEmailOutputBody] = useState("")

  // Full-screen edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedSubject, setEditedSubject] = useState("")
  const [editedPreheader, setEditedPreheader] = useState("")
  const [editedBody, setEditedBody] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [editCopied, setEditCopied] = useState(false)

  const handleAnalyze = async () => {
    // Validation
    if (!contentType) {
      setError("Please select a content type")
      return
    }

    if (contentType === "email") {
      if (!emailSubject.trim() && !emailPreheader.trim() && !emailBody.trim()) {
        setError("Please enter at least one email field")
        return
      }
    } else {
      if (!inputContent.trim()) {
        setError("Please enter some content to analyze")
        return
      }
    }

    setIsLoading(true)
    setError("")
    setOutputContent("")
    setImprovements([])
    setEmailOutputSubject("")
    setEmailOutputPreheader("")
    setEmailOutputBody("")

    try {
      const requestBody = contentType === "email"
        ? {
            contentType: contentType,
            emailContent: {
              subject: emailSubject,
              preheader: emailPreheader,
              body: emailBody,
            }
          }
        : {
            content: inputContent,
            contentType: contentType,
          }

      const response = await fetch("/api/analyze-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze content")
      }

      const data = await response.json()

      if (contentType === "email" && data.emailContent) {
        setEmailOutputSubject(data.emailContent.subject || "")
        setEmailOutputPreheader(data.emailContent.preheader || "")
        setEmailOutputBody(data.emailContent.body || "")
      } else {
        setOutputContent(data.rewrittenContent)
      }

      setImprovements(data.improvements || [])
    } catch (err) {
      setError("Failed to analyze content. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    const textToCopy = contentType === "email"
      ? `Subject: ${emailOutputSubject}\n\nPreheader: ${emailOutputPreheader}\n\n${emailOutputBody}`
      : outputContent

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const hasEmailOutput = emailOutputSubject || emailOutputPreheader || emailOutputBody
  const hasOutput = contentType === "email" ? hasEmailOutput : outputContent

  const handleOpenEditModal = () => {
    if (contentType === "email") {
      setEditedSubject(emailOutputSubject)
      setEditedPreheader(emailOutputPreheader)
      setEditedBody(emailOutputBody)
    } else {
      setEditedContent(outputContent)
    }
    setIsEditModalOpen(true)
  }

  const handleCopyEdited = () => {
    const textToCopy = contentType === "email"
      ? `Subject: ${editedSubject}\n\nPreheader: ${editedPreheader}\n\n${editedBody}`
      : editedContent

    navigator.clipboard.writeText(textToCopy).then(() => {
      setEditCopied(true)
      setTimeout(() => setEditCopied(false), 2000)
    })
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Content Analyzer</h1>
        </div>
        <p className="text-muted-foreground">
          Analyze and optimize your marketing content using AI
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type" className="text-base font-semibold">
                  Content Type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {contentType === "email" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-subject" className="text-sm font-medium">
                      Subject Line
                    </Label>
                    <input
                      id="email-subject"
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject line..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailSubject.length} characters {emailSubject.length > 0 && `• Optimal: 40-50 chars`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-preheader" className="text-sm font-medium">
                      Preheader Text
                    </Label>
                    <input
                      id="email-preheader"
                      type="text"
                      value={emailPreheader}
                      onChange={(e) => setEmailPreheader(e.target.value)}
                      placeholder="Enter preheader text..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailPreheader.length} characters {emailPreheader.length > 0 && `• Optimal: 40-130 chars`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-body" className="text-sm font-medium">
                      Email Body
                    </Label>
                    <Textarea
                      id="email-body"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Paste your email body content here..."
                      rows={10}
                      className="resize-none font-mono"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailBody.length} characters
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="input-content" className="text-sm font-medium">
                    Original Content
                  </Label>
                  <Textarea
                    id="input-content"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Paste your content here..."
                    rows={16}
                    className="resize-none font-mono"
                  />
                  <p className="text-muted-foreground text-xs">
                    {inputContent.length} characters
                  </p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !contentType || (contentType !== "email" && !inputContent.trim())}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold gap-2"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Analyze & Rewrite
                  </>
                )}
              </Button>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/50 border-2 border-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              {isLoading ? (
                contentType === "email" ? (
                  <div className="space-y-4">
                    {/* Spacer to align with Subject Line on left */}
                    <div className="h-[72px]"></div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Rewritten Subject Line
                      </Label>
                      <div className="flex h-10 w-full rounded-md border bg-muted/50 px-3 py-2">
                        <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
                      </div>
                      <p className="text-muted-foreground text-xs h-4">&nbsp;</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Rewritten Preheader
                      </Label>
                      <div className="flex h-10 w-full rounded-md border bg-muted/50 px-3 py-2">
                        <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
                      </div>
                      <p className="text-muted-foreground text-xs h-4">&nbsp;</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Rewritten Email Body
                      </Label>
                      <div className="w-full rounded-md border bg-muted/50 px-3 py-2 space-y-2" style={{ height: '250px' }}>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-4/5"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
                      </div>
                      <p className="text-muted-foreground text-xs h-4">&nbsp;</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Spacer to align with Original Content on left (accounting for Content Type dropdown) */}
                    <div className="h-[72px]"></div>

                    <Label className="text-sm font-medium">
                      Rewritten Content
                    </Label>
                    <div className="w-full rounded-md border bg-muted/50 px-3 py-2 space-y-2" style={{ height: '400px' }}>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-4/5"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
                    </div>
                    <p className="text-muted-foreground text-xs">&nbsp;</p>
                  </div>
                )
              ) : contentType === "email" ? (
                <div className="space-y-4">
                  {/* Spacer to align with Subject Line on left (accounting for Content Type dropdown) */}
                  <div className="h-[72px]"></div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Rewritten Subject Line
                    </Label>
                    <input
                      type="text"
                      value={emailOutputSubject}
                      readOnly
                      placeholder="Rewritten subject will appear here..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailOutputSubject ? `${emailOutputSubject.length} characters` : '\u00A0'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Rewritten Preheader
                    </Label>
                    <input
                      type="text"
                      value={emailOutputPreheader}
                      readOnly
                      placeholder="Rewritten preheader will appear here..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailOutputPreheader ? `${emailOutputPreheader.length} characters` : '\u00A0'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Rewritten Email Body
                    </Label>
                    <Textarea
                      value={emailOutputBody}
                      readOnly
                      placeholder="Rewritten email body will appear here..."
                      rows={10}
                      className="resize-none font-mono"
                    />
                    <p className="text-muted-foreground text-xs h-4">
                      {emailOutputBody ? `${emailOutputBody.length} characters` : '\u00A0'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Spacer to align with Original Content on left (accounting for Content Type dropdown) */}
                  <div className="h-[72px]"></div>

                  <Label className="text-sm font-medium">
                    Rewritten Content
                  </Label>
                  <Textarea
                    value={outputContent}
                    readOnly
                    placeholder="Rewritten content will appear here..."
                    rows={16}
                    className="resize-none font-mono"
                  />
                  {outputContent && (
                    <p className="text-muted-foreground text-xs">
                      {outputContent.length} characters
                    </p>
                  )}
                </div>
              )}

              {!isLoading && hasOutput && (
                <div className="space-y-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleOpenEditModal}
                    variant="outline"
                    className="w-full"
                  >
                    <Maximize2 className="mr-2 h-4 w-4" /> Edit Full Screen
                  </Button>
                </div>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Key Improvements
                  </Label>
                  <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 flex-shrink-0">•</span>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 flex-shrink-0">•</span>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 flex-shrink-0">•</span>
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && improvements.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Key Improvements
                  </Label>
                  <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500 rounded-lg p-4 space-y-2">
                    {improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-rose-600 dark:text-rose-400 flex-shrink-0">•</span>
                        <p className="text-sm">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Best Practices Summary */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">Content Writing Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">✂️ Keep it Short</h4>
                <p className="text-sm text-foreground/70">
                  Short sentences. Fewer commas. More periods.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">🎯 Benefit-Driven</h4>
                <p className="text-sm text-foreground/70">
                  Lead with benefits. Use metrics when possible.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">⚡ Action-Oriented</h4>
                <p className="text-sm text-foreground/70">
                  Start with verbs. Make the reader the hero.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">🚫 No Exclamation Points</h4>
                <p className="text-sm text-foreground/70">
                  Never. Keep tone calm and factual.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">📋 Make it Scannable</h4>
                <p className="text-sm text-foreground/70">
                  Use bullets. Clear hierarchies. One idea per paragraph.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">🔧 Technical Precision</h4>
                <p className="text-sm text-foreground/70">
                  Use technical terms clearly. Avoid buzzwords.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">✨ Active Voice</h4>
                <p className="text-sm text-foreground/70">
                  Say &quot;you&quot; more than &quot;we&quot;. Stay positive.
                </p>
              </div>
              <div className="bg-card border-2 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1.5">❌ Strip Qualifiers</h4>
                <p className="text-sm text-foreground/70">
                  Remove &quot;basically&quot;, &quot;probably&quot;, &quot;might&quot;.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full-Screen Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Content</DialogTitle>
            <DialogDescription>
              Make any edits to your content before copying.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {contentType === "email" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject" className="text-sm font-medium">
                    Subject Line
                  </Label>
                  <input
                    id="edit-subject"
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <p className="text-muted-foreground text-xs">
                    {editedSubject.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-preheader" className="text-sm font-medium">
                    Preheader Text
                  </Label>
                  <input
                    id="edit-preheader"
                    type="text"
                    value={editedPreheader}
                    onChange={(e) => setEditedPreheader(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <p className="text-muted-foreground text-xs">
                    {editedPreheader.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-body" className="text-sm font-medium">
                    Email Body
                  </Label>
                  <Textarea
                    id="edit-body"
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={20}
                    className="resize-y min-h-[200px] font-mono"
                  />
                  <p className="text-muted-foreground text-xs">
                    {editedBody.length} characters
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-sm font-medium">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={25}
                  className="resize-y min-h-[400px] font-mono"
                />
                <p className="text-muted-foreground text-xs">
                  {editedContent.length} characters
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t flex gap-2">
            <Button
              onClick={handleCopyEdited}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {editCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy Edited Content
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
