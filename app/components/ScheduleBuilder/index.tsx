// index.tsx
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { ScheduleList } from './ScheduleList';
import { MainContent } from './MainContent';
import CreateScheduleDialog from './CreateScheduleDialog';
import SavedCoursesPanel from './SavedCoursesPanel';
import { TEST_USER_ID } from '@/lib/constants';

const GET_SCHEDULES = gql`
  query GetSchedules($userId: String!) {
    schedules(userId: $userId) {
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

const ScheduleBuilder = () => {
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { loading, error, data, refetch } = useQuery(GET_SCHEDULES, {
    variables: { userId: TEST_USER_ID },
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  useEffect(() => {
    if (data?.schedules?.length > 0 && !activeSchedule) {
      setActiveSchedule(data.schedules[0]);
    } else if (activeSchedule) {
      // Update active schedule with latest data
      const updatedSchedule = data?.schedules.find(s => s.id === activeSchedule.id);
      if (updatedSchedule) {
        setActiveSchedule(updatedSchedule);
      }
    }
  }, [data, activeSchedule]);

  const handleRemoveCourse = async (courseId) => {
    try {
      const updatedCourseIds = activeSchedule.courses
        .filter(course => course.id !== courseId)
        .map(course => course.id);

      await updateSchedule({
        variables: {
          input: {
            id: activeSchedule.id,
            courseIds: updatedCourseIds
          }
        }
      });
      refetch();
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error loading schedules: {error.message}</p>
      </div>
    );
  }

  const schedules = data?.schedules || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Builder</h1>
        <div className="space-x-4">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            New Schedule
          </button>
          <Link
            href="/courses"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search Courses
          </Link>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Schedules Yet</h2>
          <p className="text-gray-600 mb-6">
            Start by creating a new schedule or searching for courses
          </p>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mr-4"
          >
            Create Schedule
          </button>
          <Link
            href="/courses"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Schedules & Saved Courses */}
          <div className="lg:col-span-1 space-y-6">
            <ScheduleList
              schedules={schedules}
              activeSchedule={activeSchedule}
              onScheduleSelect={setActiveSchedule}
              onNewSchedule={() => setIsCreateDialogOpen(true)}
            />
            <SavedCoursesPanel
              activeSchedule={activeSchedule}
              userId={TEST_USER_ID}
              onCoursesUpdated={refetch}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <MainContent
              activeSchedule={activeSchedule}
              onRemoveCourse={handleRemoveCourse}
            />
          </div>
        </div>
      )}

      <CreateScheduleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={TEST_USER_ID}
        onScheduleCreated={refetch}
      />
    </div>
  );
};

export default ScheduleBuilder;