import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Course Schedule Optimizer
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Build your perfect class schedule with our easy-to-use course
            planner. Search courses, create conflict-free schedules, and
            organize your academic term.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg 
                     font-semibold hover:bg-blue-700 transition duration-200"
          >
            Search Courses
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Search</h3>
              <p className="text-gray-600">
                Easily search and filter through available courses by subject,
                number, or instructor.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Builder</h3>
              <p className="text-gray-600">
                Create and manage multiple schedules with automatic conflict
                detection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Weekly View</h3>
              <p className="text-gray-600">
                Visualize your schedule in an intuitive weekly calendar format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to build your schedule?
          </h2>
          <div className="space-x-4">
            <Link
              href="/courses"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg 
                       font-semibold hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg 
                       font-semibold hover:bg-gray-50 transition duration-200 
                       border border-blue-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
