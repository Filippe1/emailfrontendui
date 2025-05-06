import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req) {
  try {
    const { prompt, files } = await req.json()

    // In a real implementation, you would process the uploaded files here
    // For now, we'll just use the prompt to generate copy

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert email copywriter. Create compelling, professional email copy based on the user's prompt.",
      prompt: `
        Create email copy based on the following prompt:
        ${prompt}
        
        ${files && files.length > 0 ? `Consider the following files: ${files.join(", ")}` : ""}
        
        The copy should be professional, engaging, and optimized for email marketing.
      `,
    })

    return Response.json({ copy: text });
  } catch (error) {
    console.error("Error generating email copy:", error)
    return Response.json({ error: "Failed to generate email copy" }, { status: 500 });
  }
}
