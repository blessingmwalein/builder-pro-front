'use client';

import React, { useEffect } from 'react';

export default function GoogleCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preserve incoming query string and perform a client-side replace to avoid adding history entries.
    const qs = window.location.search?.replace(/^\?/, '') ?? '';
    const target = qs ? `/auth/google/callback?${qs}` : '/auth/google/callback';
    window.location.replace(target);
  }, []);

  return <div className="sr-only">Processing Google sign-in...</div>;
}
