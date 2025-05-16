import { useState, useRef } from 'react';
import EmailEditor from '../components/ui/EmailEditor';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mjmlInput, setMjmlInput] = useState(''); // New state for MJML input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() && !selectedFile) {
      setError('Please enter a prompt or select a PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (selectedFile) {
      formData.append('pdfFile', selectedFile);
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData, // Important: Use FormData for file uploads
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text found';
      setResponse(text);
      // Automatically set the MJML editor with the response
      setMjmlInput(text);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gemini AI with PDF</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ask any question or provide a PDF for the Gemini 2.0 Flash model
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                id="prompt"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Explain the content of the attached PDF..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File (Optional)
              </label>
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={loading}
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                onClick={handleButtonClick}
                disabled={loading}
              >
                {selectedFile ? selectedFile.name : 'Select PDF'}
              </button>
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-500">Selected file: {selectedFile.name}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Response'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div>
              <h1>MJML Converter</h1>
              <EmailEditor initialMjml={mjmlInput}/>
            </div>
      </div>
    </div>
  );
}