// app/components/Calendar/ScheduleCalendar.tsx
import React, { useState } from 'react';
import BaseWeeklyCalendar, { CalendarEvent } from './BaseWeeklyCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Course } from '@/types/schedule';

interface ScheduleCalendarProps {
  courses: Course[];
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ courses }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <>
      <BaseWeeklyCalendar
        selectedCourses={courses}
        onEventClick={setSelectedEvent}
        renderEventContent={(event) => (
          <>
            <div className="font-medium truncate">
              {event.title}
            </div>
            {event.type && (
              <div className="truncate opacity-75 text-xs">
                {event.type}
              </div>
            )}
            {event.location && (
              <div className="truncate text-[10px] opacity-60">
                {event.location}
              </div>
            )}
          </>
        )}
      />

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                {selectedEvent?.courseDetails?.title}
              </h3>
              <p className="text-sm text-gray-600">
                Instructor: {selectedEvent?.courseDetails?.instructor}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Meeting Information</h4>
              <p className="text-sm">
                {selectedEvent?.type} • {selectedEvent?.location}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleCalendar;
