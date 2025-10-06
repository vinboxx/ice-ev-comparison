'use client';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
        if (stored) {
            setTheme(stored);
            document.documentElement.classList.toggle('dark', stored === 'dark');
            document.documentElement.dataset.theme = stored;
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.dataset.theme = 'dark';
        }
    }, []);
    function toggle() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        if (typeof window !== 'undefined') localStorage.setItem('theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        document.documentElement.dataset.theme = next;
    }
    return (
        <button type="button" className="btn btn-sm" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '🌙' : '☀️'}
        </button>
    );
}
