// Polyfill for localStorage during SSR
if (typeof window === 'undefined') {
  // Create a mock localStorage for server-side rendering
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

export {};

