import { Buffer } from 'buffer';

// Add Buffer to window
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
} 