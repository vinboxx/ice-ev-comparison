import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
    title: 'ICE vs EV Comparison',
    description: 'Compare total cost of ownership of one ICE vs up to two EVs.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen flex flex-col">{children}</body>
        </html>
    );
}
