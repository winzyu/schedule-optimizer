// app/(routes)/courses/page.tsx
'use client';

import CourseSearch from '@/components/CourseSearch';

export default function CoursesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Course Search</h1>
      <CourseSearch />
    </>
  );
}
