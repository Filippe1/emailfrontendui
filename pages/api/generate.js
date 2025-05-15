//const apiKey = process.env.GEMINI_API_KEY; // Set this in your environment variables
  //  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  

// pages/api/generate.js
import formidable from 'formidable';
import fs from 'node:fs/promises';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle FormData
  },
};

async function extractPdfText(file) {
  try {
    const dataBuffer = await fs.readFile(file.filepath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error reading or parsing PDF:', error);
    return null;
  } finally {
    await fs.unlink(file.filepath); // Clean up the temporary file
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const prompt = fields.prompt?.[0] || '';
    const pdfFile = files.pdfFile?.[0];
    let pdfContent = '';

    if (pdfFile) {
      pdfContent = await extractPdfText(pdfFile) || 'Could not extract text from PDF.';
    }

    let fullPrompt = prompt;
    if (pdfContent) {
      fullPrompt += `\n\nPDF Content:\n${pdfContent}`;
    }

    if (!fullPrompt.trim()) {
      return res.status(400).json({ error: 'No prompt or PDF file provided.' });
    }
    const apiKey = process.env.GEMINI_API_KEY; // Set this in your environment variables
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
    //const apiUrl = 'YOUR_GEMINI_API_URL'; // Replace with your Gemini API endpoint
    //const apiKey = process.env.GEMINI_API_KEY; // Store your API key in environment variables

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable not set.' });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey, // Include your API key here
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ error: errorData.error || `Gemini API request failed with status ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process the request.' });
  }
}