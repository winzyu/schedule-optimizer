import CourseSearch from './_components/CourseSearch/CourseSearch';

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Course Search</h1>
      <CourseSearch />
    </div>
  );
}
