import React from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const WeeklyCalendar = ({ selectedCourses = [] }) => {
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
    return dayStr.split(',').map(d => dayMap[d]);
  };

  // Process meetings into calendar events
  const getEvents = () => {
    const events = [];
    selectedCourses.forEach(course => {
      course.meetings.forEach(meeting => {
        const [startTime, endTime] = meeting.time.split(' - ');
        const startHour = timeToHours(startTime);
        const endHour = timeToHours(endTime);
        const days = parseDays(meeting.days);
        
        days.forEach(day => {
          events.push({
            courseId: course.id,
            day,
            startHour,
            endHour,
            title: `${course.subjectCode} ${course.courseNumber}`,
            location: meeting.location,
            type: meeting.type
          });
        });
      });
    });
    return events;
  };

  const events = getEvents();

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="grid grid-cols-6 border-b">
          <div className="p-4 text-gray-500">Time</div>
          {DAYS.map(day => (
            <div key={day} className="p-4 font-semibold text-center">{day}</div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-6 border-b">
              <div className="p-2 text-sm text-gray-500">
                {hour % 12 || 12}{hour >= 12 ? 'PM' : 'AM'}
              </div>
              {DAYS.map((_, dayIndex) => (
                <div key={dayIndex} className="border-l p-2 h-16 relative" />
              ))}
            </div>
          ))}

          {/* Events */}
          {events.map((event, index) => {
            const top = (event.startHour - 8) * 64; // 64px per hour (16px padding * 4)
            const height = (event.endHour - event.startHour) * 64;
            const left = `${(event.day + 1) * (100/6)}%`;

            return (
              <div
                key={`${event.courseId}-${index}`}
                className="absolute rounded p-2 bg-blue-100 border border-blue-200 overflow-hidden"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: left,
                  width: `${100/6 - 1}%`,
                }}
              >
                <div className="text-sm font-semibold">{event.title}</div>
                <div className="text-xs text-gray-600">{event.type}</div>
                <div className="text-xs text-gray-600 truncate">{event.location}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
