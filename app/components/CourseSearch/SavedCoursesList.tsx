// app/components/CourseSearch/SavedCoursesList.tsx
import React from 'react';
import type { Course } from '@/types/schedule';

interface SavedCoursesListProps {
  courses: Course[];
  onCourseRemove: (course: Course) => void;
  onCoursePreview: (course: Course) => void;
}

const SavedCoursesList: React.FC<SavedCoursesListProps> = ({
  courses,
  onCourseRemove,
  onCoursePreview,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">
        Saved Courses ({courses.length})
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => onCoursePreview(course)}
            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {course.subjectCode} {course.courseNumber}
                  {course.sectionCode && (
                    <span className="text-sm font-normal text-gray-600">
                      Section {course.sectionCode}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{course.title}</p>
                <p className="text-xs text-gray-500">
                  {course.instructor} • {course.units} units
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCourseRemove(course);
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No saved courses yet. Click "Save" on a course to add it here.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedCoursesList;
