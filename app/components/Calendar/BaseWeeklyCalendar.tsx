// app/components/Calendar/BaseWeeklyCalendar.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Meeting {
  id: string;
  time: string;
  days: string;
  type: string;
  location: string;
}

interface Course {
  id: string;
  subjectCode: string;
  courseNumber: string;
  sectionCode: string;
  title: string;
  instructor: string;
  meetings: Meeting[];
}

export interface CalendarEvent {
  courseId: string;
  courseIndex: number;
  title: string;
  subtitle: string;
  location: string;
  type: string;
  startHour: number;
  endHour: number;
  height: number;
  courseDetails: Course;
}

interface BaseWeeklyCalendarProps {
  selectedCourses: Course[];
  courseColors?: Array<{ bg: string; text: string }>;
  onEventClick?: (event: CalendarEvent) => void;
  renderEventContent?: (event: CalendarEvent) => React.ReactNode;
}

export const DEFAULT_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-orange-100', text: 'text-orange-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-teal-100', text: 'text-teal-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { bg: 'bg-red-100', text: 'text-red-800' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

export const timeToDecimalHours = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours + minutes / 60;
};

export const parseDays = (dayStr: string) => {
  const dayMap: { [key: string]: number } = { M: 0, T: 1, W: 2, R: 3, F: 4 };
  return dayStr.split(',').map((d) => dayMap[d]);
};

export const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${period}`;
};

const BaseWeeklyCalendar: React.FC<BaseWeeklyCalendarProps> = ({ 
  selectedCourses,
  courseColors = DEFAULT_COLORS,
  onEventClick,
  renderEventContent
}) => {
  const getOverlappingEvents = (dayIndex: number, hour: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    selectedCourses.forEach((course, courseIndex) => {
      course.meetings?.forEach((meeting) => {
        if (!meeting.time || !meeting.days) return;

        const [startTime, endTime] = meeting.time.split(' - ');
        const startHour = timeToDecimalHours(startTime);
        const endHour = timeToDecimalHours(endTime);
        const days = parseDays(meeting.days);

        if (days.includes(dayIndex) && hour >= startHour && hour < endHour) {
          events.push({
            courseId: course.id,
            courseIndex,
            title: `${course.subjectCode} ${course.courseNumber}`,
            subtitle: `${meeting.type}`,
            location: meeting.location,
            type: meeting.type,
            startHour,
            endHour,
            height: (endHour - startHour) * 48, // 48px per hour
            courseDetails: course,
          });
        }
      });
    });

    return events;
  };

  const defaultEventContent = (event: CalendarEvent) => (
    <>
      <div className="font-medium truncate">
        {event.title}
      </div>
      {event.type && (
        <div className="truncate opacity-75">
          {event.type}
        </div>
      )}
      {event.location && (
        <div className="truncate text-[10px] opacity-60">
          {event.location}
        </div>
      )}
    </>
  );

  return (
    <div className="bg-white rounded-lg">
      <div className="grid grid-cols-6 border-b">
        <div className="p-2 text-xs text-gray-500">Time</div>
        {DAYS.map((day) => (
          <div key={day} className="p-2 text-xs font-semibold text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="relative">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-6 border-b">
            <div className="p-1 text-xs text-gray-500">{formatHour(hour)}</div>
            {DAYS.map((_, dayIndex) => {
              const events = getOverlappingEvents(dayIndex, hour);
              return (
                <div key={dayIndex} className="border-l p-1 h-12 relative">
                  {events.length > 0 && hour === Math.floor(events[0].startHour) && (
                    <div className="absolute inset-0 flex">
                      {events.map((event, index) => {
                        const width = `${100 / events.length}%`;
                        const color = courseColors[event.courseIndex % courseColors.length];
                        return (
                          <div
                            key={`${event.courseId}-${index}`}
                            className={`${color.bg} ${color.text} cursor-pointer p-1 text-xs border-l 
                              first:border-l-0 border-white/20 hover:brightness-95 transition-all`}
                            style={{ 
                              width,
                              height: `${event.height}px`,
                              position: 'absolute',
                              left: `${(index * 100) / events.length}%`,
                              zIndex: 10
                            }}
                            onClick={() => onEventClick?.(event)}
                          >
                            {renderEventContent?.(event) || defaultEventContent(event)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseWeeklyCalendar;