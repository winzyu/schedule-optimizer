import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import type { Course, Schedule } from '../../types/schedule';

const GET_SAVED_COURSES = gql`
  query GetSavedCourses($userId: String!) {
    savedCourses(userId: $userId) {
      id
      crn
      subjectCode
      courseNumber
      sectionCode
      title
      units
      instructor
      meetings {
        id
        time
        days
        type
        location
      }
    }
  }
`;

const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($input: UpdateScheduleInput!) {
    updateSchedule(input: $input) {
      id
      name
      courses {
        id
        crn
        subjectCode
        courseNumber
        sectionCode
        title
        units
        instructor
        meetings {
          id
          time
          days
          type
          location
        }
      }
    }
  }
`;

interface SavedCoursesPanelProps {
  activeSchedule: Schedule | null;
  userId: string;
  onCoursesUpdated: () => void;
}

const SavedCoursesPanel = ({
  activeSchedule,
  userId,
  onCoursesUpdated,
}: SavedCoursesPanelProps) => {
  const { data: savedCoursesData, loading } = useQuery(GET_SAVED_COURSES, {
    variables: { userId },
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  const handleAddCourse = async (courseId: string) => {
    if (!activeSchedule) {
      alert('Please select a schedule first');
      return;
    }

    const existingCourseIds = activeSchedule.courses.map(course => course.id);
    if (existingCourseIds.includes(courseId)) {
      alert('This course is already in the schedule');
      return;
    }

    try {
      await updateSchedule({
        variables: {
          input: {
            id: activeSchedule.id,
            courseIds: [...existingCourseIds, courseId],
          },
        },
      });
      onCoursesUpdated();
    } catch (error) {
      console.error('Error adding course to schedule:', error);
      alert('Failed to add course to schedule');
    }
  };

  const savedCourses = savedCoursesData?.savedCourses || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[400px]">
      <h2 className="text-lg font-semibold mb-4">
        Saved Courses ({savedCourses.length})
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1">
        {savedCourses.map((course: Course) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2"
          >
            <div>
              <div className="font-medium">
                {course.subjectCode} {course.courseNumber}
              </div>
              <div className="text-sm text-gray-600">{course.title}</div>
              <div className="text-xs text-gray-500">
                {course.instructor} • {course.units} units
              </div>
            </div>
            <button
              onClick={() => handleAddCourse(course.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                ${
                  activeSchedule?.courses.some((c) => c.id === course.id)
                    ? 'bg-green-100 text-green-700'
                    : !activeSchedule
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
              `}
            >
              {activeSchedule?.courses.some((c) => c.id === course.id)
                ? 'Added'
                : !activeSchedule
                ? 'Select Schedule'
                : 'Add to Schedule'}
            </button>
          </div>
        ))}
        {savedCourses.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No saved courses. Go to Course Search to save some courses.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedCoursesPanel;
