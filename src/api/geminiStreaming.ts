const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export interface StreamOptions {
  prompt: string;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

export async function streamGeminiAPI(options: StreamOptions): Promise<void> {
  const { prompt, onChunk, onComplete, onError, signal } = options;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      
      // Parse newline-delimited JSON responses
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (text) {
            onChunk(text);
          }
        } catch (parseError) {
          // Skip lines that aren't valid JSON
          console.warn('Failed to parse chunk:', parseError);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't call onError
        return;
      }
      onError(error);
    } else {
      onError(new Error('Unknown error occurred'));
    }
  }
}
