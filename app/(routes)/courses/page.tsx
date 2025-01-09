// app/(routes)/courses/page.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/graphql/apollo';
import CourseSearch from '@/components/CourseSearch';

export default function CoursesPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Course Search</h1>
        <CourseSearch />
      </div>
    </ApolloProvider>
  );
}
