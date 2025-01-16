// components/ScheduleBuilder/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MainContent } from './MainContent';
import CreateScheduleDialog from './CreateScheduleDialog';
import SavedCoursesPanel from './SavedCoursesPanel';
import OptimizeDialog from './OptimizeDialog';

const GET_SCHEDULE = gql`
  query GetSchedule($id: ID!) {
    schedule(id: $id) {
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
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('id');

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(!scheduleId);
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { loading, error, data } = useQuery(GET_SCHEDULE, {
    variables: { id: scheduleId },
    skip: !scheduleId,
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  const activeSchedule = data?.schedule;

  // Add auth check at the start
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to create and manage schedules
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule({
        variables: {
          input: {
            id: activeSchedule.id,
            name: activeSchedule.name,
            courseIds: activeSchedule.courses.map(course => course.id)
          },
        },
      });
      setHasUnsavedChanges(false);
      setIsSaveDialogOpen(true);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleCreateSchedule = (newSchedule) => {
    setIsCreateDialogOpen(false);
    router.push(`/schedule?id=${newSchedule.id}`);
  };

  const handleOptimize = async (schedule: Course[]) => {
    try {
      // Update the schedule with the optimized version
      await updateSchedule({
        variables: {
          input: {
            id: activeSchedule.id,
            courseIds: schedule.map(course => course.id)
          },
        },
      });
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error applying optimized schedule:', error);
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      const updatedCourseIds = activeSchedule.courses
        .filter(course => course.id !== courseId)
        .map(course => course.id);

      await updateSchedule({
        variables: {
          input: {
            id: activeSchedule.id,
            courseIds: updatedCourseIds,
          },
        },
      });
      setHasUnsavedChanges(true);
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
        <p className="text-red-700">Error loading schedule: {error.message}</p>
      </div>
    );
  }

  if (!scheduleId && !isCreateDialogOpen) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Create a New Schedule</h2>
          <p className="text-gray-600 mb-6">
            Start by creating a new schedule or view your saved schedules
          </p>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mr-4"
          >
            Create Schedule
          </button>
          <Link
            href="/saved"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Saved Schedules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Builder</h1>
        <div className="space-x-4">
          {activeSchedule && (
            <>
              <button
                onClick={() => setIsOptimizeDialogOpen(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Optimize Schedule
              </button>
              <button
                onClick={handleSaveSchedule}
                disabled={!hasUnsavedChanges}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </>
          )}
          <Link
            href="/courses"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search Courses
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Right Panel - Saved Courses */}
        <div className="lg:col-span-1">
          <SavedCoursesPanel
            activeSchedule={activeSchedule}
            userId={user.id}
            onCoursesUpdated={() => setHasUnsavedChanges(true)}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <MainContent
            activeSchedule={activeSchedule}
            onRemoveCourse={(courseId) => {
              handleRemoveCourse(courseId);
              setHasUnsavedChanges(true);
            }}
          />
        </div>
      </div>

      <CreateScheduleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={user.id}
        onScheduleCreated={handleCreateSchedule}
      />

      {activeSchedule && (
        <OptimizeDialog
          open={isOptimizeDialogOpen}
          onOpenChange={setIsOptimizeDialogOpen}
          courses={activeSchedule.courses}
          onOptimize={handleOptimize}
        />
      )}

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Saved</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your schedule has been saved successfully!</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsSaveDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Continue Editing
              </button>
              <Link
                href="/saved"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View All Schedules
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleBuilder;
