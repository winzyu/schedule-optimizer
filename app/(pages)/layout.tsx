'use client';

import { ApolloProvider } from '@apollo/client';
import { client } from './_utils/apollo-client';
import './_globals/globals.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen">
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
