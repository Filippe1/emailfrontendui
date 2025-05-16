import { useState } from 'react';

export default function EmailEditor() {
  const [mjml, setMjml] = useState(`
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
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'code'

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mjml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mjml }),
      });

      const data = await response.json();
      setHtml(data.html || data.error);
    } catch (error) {
      setHtml(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create iframe content with proper email styling
  const getIframeContent = () => {
    return `
            ${html}
         `;
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
        <button 
          onClick={handleConvert} 
          disabled={isLoading}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Converting...' : 'Convert to HTML'}
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Preview</h2>
        {html ? (
          <>
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

            {activeTab === 'preview' ? (
              <iframe
                srcDoc={getIframeContent()}
                title="Email Preview"
                style={{
                  width: '100%',
                  height: '500px',
                  border: '1px solid #ddd',
                  background: 'white'
                }}
                sandbox="allow-same-origin" // Required for srcDoc to work
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
            )}
          </>
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
            {isLoading ? 'Generating preview...' : 'Convert MJML to see preview'}
          </div>
        )}
      </div>
    </div>
  );
}