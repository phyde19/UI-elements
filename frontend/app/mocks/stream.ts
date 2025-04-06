import * as responses from './responses';

/**
 * Simple streaming function that emits characters one at a time
 * 
 * @param responseType - The type of response to stream ('standard', 'code', etc.)
 * @param onChunk - Callback function for each character
 * @param onComplete - Callback function when streaming is complete
 * @param delay - Optional delay between characters in ms (default: 15)
 * @returns A cleanup function to stop streaming
 */
export function simulateResponseStream(
  responseType: 'basic' | 'standard' | 'code' | 'data-table' | 'bullet-points' | 'error' | 'complex',
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  delay: number = 15
): () => void {
  // Get the response text
  const responseKey = `${responseType}Response`;
  const text = responses[responseKey as keyof typeof responses] as string;
  
  if (!text) {
    console.error(`Response type "${responseType}" not found`);
    onComplete();
    return () => {};
  }
  
  let position = 0;
  let timer: NodeJS.Timeout | null = null;
  let stopped = false;
  
  // Function to emit the next character
  const emitNext = () => {
    if (stopped) return;
    
    if (position < text.length) {
      onChunk(text[position]);
      position++;
      timer = setTimeout(emitNext, delay);
    } else {
      onComplete();
    }
  };
  
  // Start streaming
  emitNext();
  
  // Return cleanup function
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}