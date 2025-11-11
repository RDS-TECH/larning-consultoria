'use client'
import { useEffect } from 'react';

export default function LangUpdater({ locale }: { locale: string }) {
  useEffect(() => {
    // Update the HTML lang attribute when locale changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
