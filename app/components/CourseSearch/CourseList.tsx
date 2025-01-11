// app/components/CourseSearch/CourseList.tsx
import React from 'react';
import type { Course } from '@prisma/client';

interface CourseListProps {
  courses: Course[];
  savedCourses: Course[];
  onCourseSelect: (course: Course) => void;
  onCourseRemove: (course: Course) => void;
  onCoursePreview: (course: Course) => void;
  loading?: boolean;
  error?: Error;
}

const CourseList = React.memo(({
  courses,
  savedCourses,
  onCourseSelect,
  onCourseRemove,
  onCoursePreview,
  loading,
  error,
}: CourseListProps) => {
  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error: {error.message}</p>
      </div>
    );
  }

  const handleCourseAction = (course: Course) => {
    const isSaved = savedCourses?.some((c) => c.id === course.id);
    if (isSaved) {
      onCourseRemove(course);
    } else {
      onCourseSelect(course);
    }
  };

  return (
    <div className="space-y-4">
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found</p>
      ) : (
        courses.map((course) => {
          const isSaved = savedCourses?.some((c) => c.id === course.id);
          return (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onCoursePreview(course)} // Make the entire card clickable
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {course.subjectCode} {course.courseNumber}
                  </h3>
                  <p className="text-gray-600">{course.title}</p>
                  <p className="text-sm text-gray-500">
                    {course.instructor} • {course.units} units
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card's onClick
                    handleCourseAction(course);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ml-4 
                    ${isSaved 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                >
                  {isSaved ? 'Remove' : 'Save'}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
});

CourseList.displayName = 'CourseList';
export default CourseList;