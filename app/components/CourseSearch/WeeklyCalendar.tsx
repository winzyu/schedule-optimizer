import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

// Color palette for courses (vibrant, distinguishable colors)
const COURSE_COLORS = [
  {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-200',
    text: 'text-blue-800',
  },
  {
    bg: 'bg-green-100',
    border: 'border-green-300',
    hover: 'hover:bg-green-200',
    text: 'text-green-800',
  },
  {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    hover: 'hover:bg-purple-200',
    text: 'text-purple-800',
  },
  {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    hover: 'hover:bg-orange-200',
    text: 'text-orange-800',
  },
  {
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    hover: 'hover:bg-pink-200',
    text: 'text-pink-800',
  },
  {
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    hover: 'hover:bg-teal-200',
    text: 'text-teal-800',
  },
];

const WeeklyCalendar = ({ selectedCourses = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Convert time string (e.g., "3:10 PM") to hours since midnight (e.g., 15.167)
  const timeToHours = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  // Convert day string (e.g., "M,W,F") to array of day indices
  const parseDays = (dayStr) => {
    const dayMap = { M: 0, T: 1, W: 2, R: 3, F: 4 };
    return dayStr.split(',').map((d) => dayMap[d]);
  };

  // Process meetings into calendar events
  const events = useMemo(() => {
    const allEvents = [];
    const courseColors = new Map();
    let colorIndex = 0;

    selectedCourses.forEach((course) => {
      // Assign a color to this course if it doesn't have one
      if (!courseColors.has(course.id)) {
        courseColors.set(
          course.id,
          COURSE_COLORS[colorIndex % COURSE_COLORS.length]
        );
        colorIndex++;
      }

      course.meetings.forEach((meeting) => {
        const [startTime, endTime] = meeting.time.split(' - ');
        const startHour = timeToHours(startTime);
        const endHour = timeToHours(endTime);
        const days = parseDays(meeting.days);

        days.forEach((day) => {
          allEvents.push({
            courseId: course.id,
            day,
            startHour,
            endHour,
            title: `${course.subjectCode} ${course.courseNumber}`,
            subtitle: `Section ${course.sectionCode}`,
            location: meeting.location,
            type: meeting.type,
            courseDetails: course,
            colors: courseColors.get(course.id),
          });
        });
      });
    });

    return allEvents;
  }, [selectedCourses]);

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}${period}`;
  };

  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="grid grid-cols-6 border-b">
          <div className="p-2 text-xs text-gray-500">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-xs font-semibold text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-6 border-b">
              <div className="p-1 text-xs text-gray-500">
                {formatHour(hour)}
              </div>
              {DAYS.map((_, dayIndex) => (
                <div key={dayIndex} className="border-l p-1 h-12 relative" />
              ))}
            </div>
          ))}

          {/* Events */}
          {events.map((event, index) => {
            const top = (event.startHour - 8) * 48; // 48px per hour (12px * 4)
            const height = (event.endHour - event.startHour) * 48;
            const left = `${(event.day + 1) * (100 / 6)}%`;

            return (
              <div
                key={`${event.courseId}-${index}`}
                className={`absolute rounded p-1 overflow-hidden cursor-pointer transition-all
                  ${event.colors.bg} ${event.colors.border} ${event.colors.hover}`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: left,
                  width: `${100 / 6 - 1}%`,
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className={`text-xs font-medium ${event.colors.text}`}>
                  {event.title}
                </div>
                <div className="text-xs text-gray-600">{event.subtitle}</div>
                {height > 60 && (
                  <>
                    <div className="text-xs text-gray-600">{event.type}</div>
                    <div className="text-xs text-gray-600 truncate">
                      {event.location}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.courseDetails.subjectCode}{' '}
              {selectedEvent?.courseDetails.courseNumber} - Section{' '}
              {selectedEvent?.courseDetails.sectionCode}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                {selectedEvent?.courseDetails.title}
              </h3>
              <p className="text-sm text-gray-600">
                Instructor: {selectedEvent?.courseDetails.instructor}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Course Details</h4>
              <ul className="text-sm space-y-1">
                <li>Units: {selectedEvent?.courseDetails.units}</li>
                <li>CRN: {selectedEvent?.courseDetails.crn}</li>
                {selectedEvent?.courseDetails.description && (
                  <li className="mt-2">
                    {selectedEvent.courseDetails.description}
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Meeting Times</h4>
              <ul className="text-sm space-y-2">
                {selectedEvent?.courseDetails.meetings.map((meeting, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{meeting.type}</span>
                    <span>
                      {meeting.days} {meeting.time}
                    </span>
                    <span>{meeting.location}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedEvent?.courseDetails.geCourses?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">GE Credit</h4>
                <p className="text-sm">
                  {selectedEvent.courseDetails.geCourses.join(', ')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
