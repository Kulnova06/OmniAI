import { useState } from 'react';
import './index.css';

function App() {
  const [mode, setMode] = useState('image'); // 'image' or 'text'
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    // Clear the respective output depending on the active mode
    if (mode === 'image') setGeneratedImg(null);
    else setGeneratedText(null);

    try {
      const hfApiKey = import.meta.env.VITE_HF_API_KEY;
      const textApiKey = import.meta.env.VITE_HF_TEXT_API_KEY || hfApiKey;

      if (mode === 'image') {
        if (!hfApiKey) {
          throw new Error("API Key is missing. Please add VITE_HF_API_KEY to your .env file.");
        }

        const response = await fetch(
          "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
          {
            headers: {
              Authorization: `Bearer ${hfApiKey}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to generate image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImg(imageUrl);

      } else {
        // Text generation mode
        if (!textApiKey) {
          throw new Error("API Key is missing. Please add VITE_HF_API_KEY or VITE_HF_TEXT_API_KEY to your .env file.");
        }
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: [
                { role: "user", content: prompt }
              ],
              max_tokens: 300,
              temperature: 0.7,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error?.message || errorData?.error || `Failed: ${response.statusText}`);
        }
        const data = await response.json();
        setGeneratedText(
          data?.choices?.[0]?.message?.content || "No response"
        );

      } // ← else close

    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred while generating.");
    } finally {
      setIsGenerating(false);
    }
  }
  // ← handleGenerate properly closed
  const handleModeChange = (newMode) => {
    if (isGenerating) return;
    setMode(newMode);
    setError(null);
  };

  return (
    <>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>

      <div className="app-container">
        <div className="header">
          <h1>Omni AI</h1>
          <p>Transform your imagination into stunning visuals or text.</p>
        </div>

        <div className="mode-switcher">
          <button
            className={`mode-btn ${mode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeChange('image')}
            disabled={isGenerating}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Image
          </button>
          <button
            className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
            disabled={isGenerating}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Text
          </button>
        </div>

        <form className="input-group" onSubmit={handleGenerate}>
          <input
            type="text"
            className="prompt-input"
            placeholder={mode === 'image' ? "A futuristic neon city at night, cyberpunk aesthetic..." : "Write a story about a cybernetic detective..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <button
            type="submit"
            className="generate-btn"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Processing...' : mode === 'image' ? 'Generate Art' : 'Generate Text'}
            {!isGenerating && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {mode === 'image' ? (
          <div className={`display-pane image-display ${generatedImg && !error ? 'has-content' : ''}`}>
            {isGenerating ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Dreaming up your image...</p>
              </div>
            ) : generatedImg && !error ? (
              <img src={generatedImg} alt="Generated result" className="generated-image" />
            ) : !error ? (
              <div className="placeholder-msg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>Your creation will appear here</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={`display-pane text-display ${generatedText && !error ? 'has-content' : ''}`}>
            {isGenerating ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Processing text...</p>
              </div>
            ) : generatedText && !error ? (
              <div className="text-content">
                {generatedText}
              </div>
            ) : !error ? (
              <div className="placeholder-msg">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <p>Your text will appear here</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default App