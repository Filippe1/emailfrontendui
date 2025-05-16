import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; // or implement your own debounce

export default function EmailEditor({ initialMjml = '' }) {
  const [mjml, setMjml] = useState(initialMjml || `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>Hello World</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState(null);

  // Debounced conversion function
  const convertMjml = useCallback(debounce(async (mjmlCode) => {
    if (!mjmlCode.trim()) {
      setHtml('');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/mjml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mjml: mjmlCode }),
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const data = await response.json();
      setHtml(data.html);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message);
      setHtml('');
    } finally {
      setIsLoading(false);
    }
  }, 500), []); // 500ms debounce delay

  // Automatically convert when MJML changes
  useEffect(() => {
    convertMjml(mjml);
    return () => convertMjml.cancel(); // Cleanup on unmount
  }, [mjml, convertMjml]);

  // Handle initial prop changes
  useEffect(() => {
    if (initialMjml) {
      setMjml(initialMjml);
    }
  }, [initialMjml]);

  const getIframeContent = () => {
    return `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background: #f5f5f5; }
            .email-container { max-width: 600px; margin: 0 auto; background: white; }
          </style>
        </head>
        <body>
          <div class="email-container">
            ${html}
          </div>
        </body>
      </html>`;
  };

  return (
    <div style={{ display: 'flex', gap: '20px', margin: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>MJML Editor</h2>
        <textarea
          value={mjml}
          onChange={(e) => setMjml(e.target.value)}
          rows={20}
          style={{ 
            width: '100%',
            fontFamily: 'monospace',
            padding: '10px',
            minHeight: '400px'
          }}
        />
        <div style={{ marginTop: '10px', minHeight: '24px' }}>
          {isLoading && <span>Converting...</span>}
          {error && <span style={{ color: 'red' }}>Error: {error}</span>}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Preview</h2>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'preview' ? '#0070f3' : '#eaeaea',
              color: activeTab === 'preview' ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Preview
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'code' ? '#0070f3' : '#eaeaea',
              color: activeTab === 'code' ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '5px'
            }}
          >
            HTML Code
          </button>
        </div>

        {isLoading ? (
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            textAlign: 'center',
            border: '1px dashed #ccc',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Converting MJML...
          </div>
        ) : html ? (
          activeTab === 'preview' ? (
            <iframe
              srcDoc={getIframeContent()}
              title="Email Preview"
              style={{
                width: '100%',
                height: '500px',
                border: '1px solid #ddd',
                background: 'white'
              }}
              sandbox="allow-same-origin"
            />
          ) : (
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              overflow: 'auto',
              height: '500px',
              border: '1px solid #ddd'
            }}>
              {html}
            </pre>
          )
        ) : (
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            textAlign: 'center',
            border: '1px dashed #ccc',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {error ? 'Error in MJML' : 'Enter MJML to see preview'}
          </div>
        )}
      </div>
    </div>
  );
}