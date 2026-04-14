import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Fix for "TypeError: Cannot set property fetch of #<Window> which has only a getter"
// Some dependencies try to overwrite fetch, which fails if it's only a getter in this environment.
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    console.warn('Could not re-define fetch as writable:', e);
  }
}

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
