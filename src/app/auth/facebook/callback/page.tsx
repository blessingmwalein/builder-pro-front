'use client';
import React, { useEffect } from 'react';

export default function FacebookCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preserve incoming query string and perform a client-side replace (no history entry).
    const qs = window.location.search?.replace(/^\?/, '') ?? '';
    const target = qs ? `/auth/facebook/callback?${qs}` : '/auth/facebook/callback';
    window.location.replace(target);
  }, []);

  return <div className="sr-only">Processing Facebook sign-in...</div>;
}
