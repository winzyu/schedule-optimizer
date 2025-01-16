// app/layout.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/graphql/apollo';
import Navigation from '@/components/Navigation';
import '@/styles/globals.scss';
import { AuthProvider } from './lib/contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ApolloProvider client={apolloClient}>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="max-w-[1400px] mx-auto py-6 px-6">
                {children}
              </main>
            </div>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
