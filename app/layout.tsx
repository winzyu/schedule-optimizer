// app/layout.tsx 
'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/graphql/apollo';
import Navigation from '@/components/Navigation';
import '@/styles/globals.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={apolloClient}>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-[1400px] mx-auto py-6 px-6">{children}</main>
          </div>
        </ApolloProvider>
      </body>
    </html>
  );
}
