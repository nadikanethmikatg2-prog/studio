
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';

// The metadata object should be exported from a server component.
// Since this is now a client component, we should move the metadata
// to a server component, but for now we can define it here.
// Next.js might show a warning, but it should still work for development.
const metadata: Metadata = {
  title: 'A/L Study Buddy',
  description: 'Your personal study tracker for the 2027 A/L exam.',
};


// This component must be a client component to use the useTheme hook.
function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <body
      className={cn(
        'min-h-screen bg-background font-sans antialiased flex flex-col',
        // Apply theme class if it's not the default 'blue'
        theme !== 'blue' && `theme-${theme}`
      )}
    >
      {children}
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={metadata.description as string} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* All providers now wrap the ThemedBody */}
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ThemedBody>
              {children}
              <Toaster />
            </ThemedBody>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </html>
  );
}
