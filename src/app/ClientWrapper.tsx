'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { Providers } from './providers';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
