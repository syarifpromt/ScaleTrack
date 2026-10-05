import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origSet = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, value) {
                    if (name === 'bis_skin_checked') return;
                    return origSet.apply(this, arguments);
                  };
                  if (typeof document !== 'undefined') {
                    document.querySelectorAll('[bis_skin_checked]').forEach(function(el) {
                      el.removeAttribute('bis_skin_checked');
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#f8f9fc] text-gray-900 font-sans antialiased selection:bg-blue-200">
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
