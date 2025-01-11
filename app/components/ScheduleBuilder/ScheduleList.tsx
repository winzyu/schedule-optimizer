// ScheduleList.tsx
import React from 'react';
import type { Schedule } from '@/types/schedule';

interface ScheduleListProps {
  schedules: Schedule[];
  activeSchedule: Schedule | null;
  onScheduleSelect: (schedule: Schedule) => void;
  onNewSchedule: () => void;
}

export const ScheduleList = ({ 
  schedules, 
  activeSchedule, 
  onScheduleSelect,
  onNewSchedule 
}: ScheduleListProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 max-h-[300px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Schedules</h2>
        <button
          onClick={onNewSchedule}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + New
        </button>
      </div>
      <div className="space-y-2">
        {schedules.map((schedule) => (
          <button
            key={schedule.id}
            onClick={() => onScheduleSelect(schedule)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeSchedule?.id === schedule.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{schedule.name}</div>
            <div className="text-sm text-gray-500">
              {schedule.courses.length} courses
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};