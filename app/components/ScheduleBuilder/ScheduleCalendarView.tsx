import React from 'react';
import type { Course } from '@/types/schedule';
import dynamic from 'next/dynamic';

const WeeklyCalendar = dynamic(
  () => import('@/components/CourseSearch/WeeklyCalendar'),
  { ssr: false }
);

interface ScheduleCalendarViewProps {
  scheduleName: string;
  courses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

const COURSE_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200' },
  { bg: 'bg-orange-100', text: 'text-orange-800', hover: 'hover:bg-orange-200' },
  { bg: 'bg-pink-100', text: 'text-pink-800', hover: 'hover:bg-pink-200' },
  { bg: 'bg-teal-100', text: 'text-teal-800', hover: 'hover:bg-teal-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', hover: 'hover:bg-indigo-200' },
  { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' },
];

export const ScheduleCalendarView = ({
  scheduleName,
  courses,
  onRemoveCourse,
}: ScheduleCalendarViewProps) => {
  const getColorForCourse = (index: number) => COURSE_COLORS[index % COURSE_COLORS.length];

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{scheduleName}</h2>
            <p className="text-gray-500">{courses.length} courses selected</p>
          </div>
        </div>
        
        {/* Scrollable course chips */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-min">
            {courses.map((course, index) => {
              const color = getColorForCourse(index);
              return (
                <button
                  key={course.id}
                  onClick={() => onRemoveCourse(course.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm whitespace-nowrap
                    ${color.bg} ${color.text} ${color.hover} transition-colors`}
                >
                  {course.subjectCode} {course.courseNumber}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1 opacity-60" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto min-h-0">
        <WeeklyCalendar 
          selectedCourses={courses} 
          courseColors={COURSE_COLORS.map(color => ({
            bg: color.bg.replace('bg-', ''),
            text: color.text.replace('text-', '')
          }))}
        />
      </div>
    </div>
  );
};