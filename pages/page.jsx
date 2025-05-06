import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, FileText, Code, ArrowRight, ArrowLeft, Upload, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function EmailGenerator() {
  // State for the two-step process
  const [activeStep, setActiveStep] = useState("copywriting")
  const [prompt, setPrompt] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [emailCopy, setEmailCopy] = useState("")
  const [htmlOutput, setHtmlOutput] = useState("")
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false)

  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  // Remove a file from the uploaded files
  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  // Generate email copywriting
  const generateEmailCopy = async () => {
    if (!prompt) return

    setIsGeneratingCopy(true)

    try {
      // In a real app, you would upload files and send the prompt to your API
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, files: uploadedFiles.map((f) => f.name) }),
      })

      const data = await response.json()
      setEmailCopy(data.copy ||
        "Sample email copy would appear here. This is a placeholder since we're not making actual API calls in this demo.")

      // Automatically move to the next step
      if (data.copy) {
        setActiveStep("html")
      }
    } catch (error) {
      console.error("Error generating email copy:", error)
      // For demo purposes, set sample data
      setEmailCopy(
        "Sample email copy would appear here. This is a placeholder since we're not making actual API calls in this demo."
      )
    } finally {
      setIsGeneratingCopy(false)
    }
  }

  // Generate HTML from the email copy
  const generateHtml = async () => {
    if (!emailCopy) return

    setIsGeneratingHtml(true)

    try {
      // In a real app, you would send the email copy to your API
      const response = await fetch("/api/generate-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailCopy }),
      })

      const data = await response.json()
      setHtmlOutput(data.html ||
        `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Template</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
  .content { padding: 20px; }
  .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Your Company</h1>
  </div>
  <div class="content">
    ${emailCopy}
  </div>
  <div class="footer">
    <p>© 2025 Your Company. All rights reserved.</p>
    <p>You're receiving this email because you signed up for updates.</p>
  </div>
</div>
</body>
</html>`)
    } catch (error) {
      console.error("Error generating HTML:", error)
      // For demo purposes, set sample data
      setHtmlOutput(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Company</h1>
    </div>
    <div class="content">
      ${emailCopy}
    </div>
    <div class="footer">
      <p>© 2025 Your Company. All rights reserved.</p>
      <p>You're receiving this email because you signed up for updates.</p>
    </div>
  </div>
</body>
</html>`)
    } finally {
      setIsGeneratingHtml(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Email Generator</h1>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeStep === "copywriting" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground"}`}>
              <FileText className="h-5 w-5" />
            </div>
            <div className="mx-2 h-1 w-16 bg-muted">
              <div
                className={`h-full ${activeStep === "html" ? "bg-primary" : "bg-muted"}`}
                style={{ width: activeStep === "copywriting" ? "0%" : "100%" }}></div>
            </div>
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeStep === "html" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground"}`}>
              <Code className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="text-center px-4">
            <p className="font-medium">Step 1</p>
            <p className="text-sm text-muted-foreground">Generate Copy</p>
          </div>
          <div className="text-center px-4">
            <p className="font-medium">Step 2</p>
            <p className="text-sm text-muted-foreground">Create HTML</p>
          </div>
        </div>
      </div>
      {/* Main content */}
      <Tabs
        value={activeStep}
        onValueChange={(value) => setActiveStep(value)}
        className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="copywriting">Email Copywriting</TabsTrigger>
          <TabsTrigger value="html">HTML Generation</TabsTrigger>
        </TabsList>

        {/* Step 1: Email Copywriting */}
        <TabsContent value="copywriting">
          <Card>
            <CardHeader>
              <CardTitle>Generate Email Copy</CardTitle>
              <CardDescription>
                Provide a prompt and upload relevant files to generate email copywriting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the email you want to create. E.g., 'Create a promotional email for our summer sale offering 20% off all products.'"
                  className="min-h-32"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Files (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, CSV (Max 10MB)</span>
                  </Label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {emailCopy && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Generated Email Copy</Label>
                    <Badge variant="outline" className="ml-2">
                      Preview
                    </Badge>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-line">{emailCopy}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button onClick={generateEmailCopy} disabled={!prompt || isGeneratingCopy}>
                {isGeneratingCopy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Copy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 2: HTML Generation */}
        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle>Generate HTML Email</CardTitle>
              <CardDescription>Convert your email copy into responsive HTML code for email campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Copy</Label>
                <Textarea
                  placeholder="Your email copy will appear here after generation in step 1."
                  className="min-h-32"
                  value={emailCopy}
                  onChange={(e) => setEmailCopy(e.target.value)} />
              </div>

              {htmlOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Generated HTML</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(htmlOutput)
                        }}>
                        Copy HTML
                      </Button>
                      <Badge variant="outline">Preview</Badge>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    <pre className="text-xs">
                      <code>{htmlOutput}</code>
                    </pre>
                  </div>
                </div>
              )}

              {htmlOutput && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Email Preview</Label>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="p-2 bg-muted border-b flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="text-xs text-center flex-1">Email Preview</div>
                      </div>
                      <iframe
                        srcDoc={htmlOutput}
                        title="Email Preview"
                        className="w-full h-96 border-0" />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("copywriting")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Copy
              </Button>
              <Button onClick={generateHtml} disabled={!emailCopy || isGeneratingHtml}>
                {isGeneratingHtml ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    {htmlOutput ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate HTML
                      </>
                    ) : (
                      <>
                        Generate HTML
                        <Code className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
