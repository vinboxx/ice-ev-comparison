'use client';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

export function Header() {
  const [title] = useState('ICE vs EV Comparison');
  return (
    <header className="navbar bg-base-200/60 backdrop-blur sticky top-0 z-10 px-4 gap-2">
      <div className="flex-1 font-semibold">{title}</div>
      <div className="flex gap-2 items-center">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
