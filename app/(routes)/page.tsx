// app/(routes)/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Schedule Optimizer</h1>
      <p className="text-xl mb-8">
        Find and organize your perfect class schedule
      </p>
      <Link
        href="/courses"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Search Courses
      </Link>
    </main>
  );
}
