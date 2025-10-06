'use client';
import { useState, useEffect } from 'react';

export function LanguageToggle({ onChange }: { onChange?: (lang: string) => void }) {
    const [lang, setLang] = useState('en');
    useEffect(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
        if (stored) setLang(stored);
    }, []);
    function toggle() {
        const next = lang === 'en' ? 'th' : 'en';
        setLang(next);
        if (typeof window !== 'undefined') localStorage.setItem('lang', next);
        onChange?.(next);
    }
    return (
        <button type="button" className="btn btn-sm" onClick={toggle} aria-label="Toggle language">
            {lang.toUpperCase()}
        </button>
    );
}
