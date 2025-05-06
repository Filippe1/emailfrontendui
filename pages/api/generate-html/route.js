import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req) {
  try {
    const { emailCopy } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert email HTML developer. Create responsive, well-structured HTML email templates based on the provided copy.",
      prompt: `
        Convert the following email copy into a responsive HTML email template:
        
        ${emailCopy}
        
        The HTML should:
        1. Be responsive and work well on mobile devices
        2. Use a clean, professional design
        3. Include proper email HTML best practices (tables, inline CSS, etc.)
        4. Have a header, content section, and footer
        5. Include unsubscribe link in the footer
        
        Return only the complete HTML code.
      `,
    })

    return Response.json({ html: text });
  } catch (error) {
    console.error("Error generating HTML:", error)
    return Response.json({ error: "Failed to generate HTML" }, { status: 500 });
  }
}
