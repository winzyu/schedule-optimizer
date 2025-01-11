// app/components/CourseSearch/CoursePreview.tsx
import React from 'react';
import type { Course } from '@/types/schedule';
import dynamic from 'next/dynamic';
import { formatHour } from '../Calendar/BaseWeeklyCalendar';

const CoursePreviewCalendar = dynamic(
  () => import('../Calendar/CoursePreviewCalendar'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />
    ),
  }
);

interface CoursePreviewProps {
  course: Course | null;
  onSave: (course: Course) => void;
  onRemove: (course: Course) => void;
  isSaved: boolean;
}

const MeetingTime: React.FC<{ meeting: any }> = ({ meeting }) => {
  return (
    <div className="mb-3 last:mb-0">
      <div className="font-medium text-sm">{meeting.type}</div>
      <div className="text-sm text-gray-600">
        {meeting.days.split(',').map((day) => {
          const dayMap = {
            M: 'Monday',
            T: 'Tuesday',
            W: 'Wednesday',
            R: 'Thursday',
            F: 'Friday'
          };
          return dayMap[day];
        }).join(', ')}
      </div>
      <div className="text-sm text-gray-600">{meeting.time}</div>
      <div className="text-sm text-gray-500">{meeting.location}</div>
    </div>
  );
};

const CoursePreview: React.FC<CoursePreviewProps> = ({ 
  course, 
  onSave, 
  onRemove, 
  isSaved 
}) => {
  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Course Preview</h2>
        <p className="text-gray-500">
          Click on a course to preview it in the weekly calendar
        </p>
      </div>
    );
  }

  // Group meetings by type
  const meetingsByType = course.meetings.reduce((acc, meeting) => {
    const type = meeting.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meeting);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        {course.subjectCode} {course.courseNumber}
      </h2>
      <div className="mb-4">
        <p className="font-medium">{course.title}</p>
        <p className="text-sm text-gray-600">
          {course.instructor} • {course.units} units
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Meeting Times</h3>
        {Object.entries(meetingsByType).map(([type, meetings], index) => (
          <div key={type} className="mb-4 last:mb-0">
            <div className="font-medium text-sm text-gray-700 mb-2">{type}</div>
            {meetings.map((meeting, mIndex) => (
              <MeetingTime key={mIndex} meeting={meeting} />
            ))}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <CoursePreviewCalendar course={course} />
      </div>

      <button
        onClick={() => isSaved ? onRemove(course) : onSave(course)}
        className={`w-full py-2 rounded-lg transition-colors ${
          isSaved
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isSaved ? 'Remove Course' : 'Save Course'}
      </button>
    </div>
  );
};

export default CoursePreview;
