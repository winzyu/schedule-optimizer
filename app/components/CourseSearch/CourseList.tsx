// app/components/CourseSearch/CourseList.tsx
import React, { useState } from 'react';
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

const RESULTS_PER_PAGE = 10;

const CourseList = React.memo(({
  courses,
  savedCourses,
  onCourseSelect,
  onCourseRemove,
  onCoursePreview,
  loading,
  error,
}: CourseListProps) => {
  const [showAllResults, setShowAllResults] = useState(false);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
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

  const displayedCourses = showAllResults ? courses : courses.slice(0, RESULTS_PER_PAGE);
  const hasMoreResults = courses.length > RESULTS_PER_PAGE;

  const handleCourseAction = (course: Course) => {
    const isSaved = savedCourses?.some((c) => c.id === course.id);
    if (isSaved) {
      onCourseRemove(course);
    } else {
      onCourseSelect(course);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px] flex flex-col">
      <div className="overflow-y-auto flex-1">
        <div className="space-y-4">
          {displayedCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No courses found</p>
          ) : (
            displayedCourses.map((course) => {
              const isSaved = savedCourses?.some((c) => c.id === course.id);
              return (
                <div
                  key={course.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onCoursePreview(course)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {course.subjectCode} {course.courseNumber}
                        {course.sectionCode && (
                          <span className="text-sm font-normal text-gray-600">
                            Section {course.sectionCode}
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        {course.instructor} • {course.units} units
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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
      </div>
      
      {hasMoreResults && !showAllResults && (
        <button
          onClick={() => setShowAllResults(true)}
          className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Show More Results ({courses.length - RESULTS_PER_PAGE} remaining)
        </button>
      )}
    </div>
  );
});

CourseList.displayName = 'CourseList';
export default CourseList;