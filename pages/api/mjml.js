// pages/api/mjml.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { mjml } = req.body;
  
      // Combine App ID + API Key for Basic Auth
      const auth = `${process.env.MJML_APP_ID}:${process.env.MJML_API_KEY}`;
      const authToken = Buffer.from(auth).toString('base64');
  
      const response = await fetch('https://api.mjml.io/v1/render', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mjml }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'MJML API error');
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('MJML API Error:', error);
      res.status(500).json({ error: error.message });
    }
  }