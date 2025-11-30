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
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Split by newlines and process complete lines
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';
      
      // Process complete lines
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        try {
          const data = JSON.parse(trimmedLine);
          
          // Handle different response formats
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                      data.text ||
                      data.content?.parts?.[0]?.text;
          
          if (text) {
            onChunk(text);
          } else if (data.error) {
            throw new Error(data.error.message || 'API returned an error');
          }
        } catch (parseError) {
          // Only log actual parse errors, not incomplete chunks
          if (parseError instanceof SyntaxError && trimmedLine.length > 10) {
            console.error('Failed to parse response:', trimmedLine.substring(0, 100));
          }
        }
      }
    }
    
    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                    data.text ||
                    data.content?.parts?.[0]?.text;
        if (text) {
          onChunk(text);
        }
      } catch (parseError) {
        // Ignore final incomplete chunk
        console.debug('Skipping final incomplete chunk');
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
