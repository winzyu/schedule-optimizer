// app/components/Calendar/CoursePreviewCalendar.tsx
import React from 'react';
import BaseWeeklyCalendar, { DEFAULT_COLORS } from './BaseWeeklyCalendar';
import type { Course } from '@/types/schedule';

interface CoursePreviewCalendarProps {
  course: Course;
}

const CoursePreviewCalendar: React.FC<CoursePreviewCalendarProps> = ({ course }) => {
  return (
    <BaseWeeklyCalendar
      selectedCourses={[course]}
      courseColors={[DEFAULT_COLORS[0]]} // Always use first color for preview
      renderEventContent={(event) => (
        <>
          <div className="font-medium truncate">
            {event.title}
          </div>
          <div className="truncate opacity-75 text-xs">
            {event.type}
          </div>
        </>
      )}
    />
  );
};

export default CoursePreviewCalendar;
