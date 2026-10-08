import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClientExtensionCleanup } from '@/components/common/ClientExtensionCleanup';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ScaleTrack | Sistem Penimbangan Digital',
  description: 'Aplikasi penimbangan digital pintar yang mudah, cepat, dan akurat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#f8f9fc] text-gray-900 font-sans antialiased selection:bg-blue-200">
        <ClientExtensionCleanup />
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <TopBar />
        
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 pt-16 lg:pl-64 pb-16 lg:pb-0">
            {children}
          </main>
          
          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
