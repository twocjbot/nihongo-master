'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#111827', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.15)' }
      }}
    />
  );
}
