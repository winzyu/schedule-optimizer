// MainContent.tsx
import React from 'react';
import type { Schedule } from '@/types/schedule';
import { ScheduleCalendarView } from './ScheduleCalendarView';

interface MainContentProps {
  activeSchedule: Schedule | null;
  onRemoveCourse: (courseId: string) => void;
}

export const MainContent = ({
  activeSchedule,
  onRemoveCourse,
}: MainContentProps) => {
  if (!activeSchedule) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center h-[600px] flex items-center justify-center">
        <p className="text-gray-500">Select a schedule to view and edit it</p>
      </div>
    );
  }

  return (
    <ScheduleCalendarView
      scheduleName={activeSchedule.name}
      courses={activeSchedule.courses}
      onRemoveCourse={onRemoveCourse}
    />
  );
};
