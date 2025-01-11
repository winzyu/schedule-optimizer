// app/components/ScheduleBuilder/ScheduleCalendarView.tsx
import React from 'react';
import type { Course } from '@/types/schedule';
import ScheduleCalendar from '@/components/Calendar/ScheduleCalendar';

interface ScheduleCalendarViewProps {
  scheduleName: string;
  courses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

export const ScheduleCalendarView = ({
  scheduleName,
  courses,
  onRemoveCourse,
}: ScheduleCalendarViewProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{scheduleName}</h2>
          <p className="text-gray-500">{courses.length} courses selected</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onRemoveCourse(course.id)}
              className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 whitespace-nowrap"
            >
              {course.subjectCode} {course.courseNumber}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 text-gray-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <ScheduleCalendar courses={courses} />
      </div>
    </div>
  );
};

export default ScheduleCalendarView;