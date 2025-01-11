// app/(routes)/courses/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Create a loading component
const LoadingState = () => (
  <div className="max-w-[1400px] mx-auto px-6 py-4">
    <h1 className="text-3xl font-bold mb-8">Course Search</h1>
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Dynamically import CourseSearch with loading state
const CourseSearch = dynamic(() => import('@/components/CourseSearch'), {
  loading: () => <LoadingState />,
  ssr: false, // Disable server-side rendering for this component
});

export default function CoursesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Course Search</h1>
      <CourseSearch />
    </>
  );
}
