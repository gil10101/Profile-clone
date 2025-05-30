/**
 * Utility functions for the  animations
 */

/**
 * Shuffle an array in place
 */
export function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Clamp a value between a min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Add leading zeros to a number
 */
export function leadingZeros(num: number, places: number): string {
  const str = num.toString();
  return "0".repeat(places - str.length) + str;
}

/**
 * Parse HTML content for processing in text effects
 */
export function parseHTML(html: string) {
  const tagPattern = /<[^>]+>/;
  const entityPattern = /&[^;\s]+;/;
  const combinedPattern = new RegExp(`(${tagPattern.source}|${entityPattern.source})`);
  const nbsp = "&nbsp;";
  
  // Split HTML into chunks (tags and text)
  const chunks: string[] = [];
  let remaining = html;
  
  while (remaining.length) {
    const match = remaining.match(new RegExp(`^${combinedPattern.source}`));
    const chunk = (match || remaining)[0];
    remaining = remaining.substr(chunk.length);
    chunks.push(chunk);
  }
  
  // Create start array with HTML preserved
  const start = chunks.map(chunk => {
    if (tagPattern.test(chunk)) return chunk;
    return chunk === " " ? nbsp : "";
  });
  
  // Create a queue of actual characters to animate
  const queue = chunks.reduce((acc, chunk, index) => {
    if (!tagPattern.test(chunk)) {
      acc.push({
        index,
        char: chunk
      });
    }
    return acc;
  }, [] as {index: number, char: string}[]);
  
  // Text array for reference
  const text = queue.map(item => item.char);
  
  return {
    items: chunks,
    start,
    queue,
    text
  };
}

/**
 * Wrap text in a span with a class
 */
export function wrapInSpan(text: string, className: string = 'temp'): string {
  return `<span class="${className}">${text}</span>`;
}

/**
 * Get a random character from a string
 */
export function getRandomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * The original greetings from 
 */
export const greetings = [
  "Konnichiwa", "Namaste", "Hello", "Salut", "Hola", "Hey", "Olà", "Hi"
];

/**
 * Get lines from an element to create a typing effect for multiple lines
 */
export function getLines(el: HTMLElement, text: string, callback: (lines: string[]) => void) {
  const originalContent = el.innerHTML;
  const chunkClass = "__chunk__";
  
  // Split text into word spans to measure line breaks
  el.innerHTML = text.split(" ").map(word => 
    `<span class="${chunkClass}">${word}</span>`
  ).join(" ");
  
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let prevTop = -1;
  
  // Group words by their vertical position
  const wordElements = el.querySelectorAll(`.${chunkClass}`);
  wordElements.forEach(wordEl => {
    const top = wordEl.getBoundingClientRect().top;
    if (top !== prevTop) {
      prevTop = top;
      currentLine = [wordEl.innerHTML];
      lines.push(currentLine);
    } else {
      currentLine.push(wordEl.innerHTML);
    }
  });
  
  // Restore original content
  el.innerHTML = originalContent;
  
  // Call callback with joined lines
  callback(lines.map(line => line.join(" ")));
}

/**
 * Easing functions
 */
export const Easing = {
  Linear: (t: number) => t,
  Sine: {
    in: (t: number) => 1 - Math.cos(t * Math.PI / 2),
    out: (t: number) => Math.sin(t * Math.PI / 2),
    inOut: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
  },
  Quint: {
    in: (t: number) => t * t * t * t * t,
    out: (t: number) => 1 - Math.pow(1 - t, 5),
    inOut: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
  }
}; 