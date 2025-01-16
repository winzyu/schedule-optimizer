import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScheduleCalendar from '@/components/Calendar/ScheduleCalendar';
import { useAuth } from '@/lib/contexts/AuthContext';

const GET_SAVED_SCHEDULES = gql`
  query GetSchedules($userId: String!) {
    schedules(userId: $userId) {
      id
      name
      createdAt
      updatedAt
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

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) {
    deleteSchedule(id: $id)
  }
`;

const SavedSchedules = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(GET_SAVED_SCHEDULES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [deleteSchedule] = useMutation(DELETE_SCHEDULE);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule({
          variables: { id: scheduleId },
        });
        refetch();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Component will redirect in useEffect
  }

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

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No Saved Schedules</h2>
        <p className="text-gray-600 mb-6">
          Create and save schedules in the Schedule Builder
        </p>
        <Link
          href="/schedule"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Schedule Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">{schedule.name}</h3>
              <p className="text-sm text-gray-500">
                {schedule.courses.length} courses • Last updated{' '}
                {new Date(schedule.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-4">
              <Link
                href={`/schedule?id=${schedule.id}`}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <ScheduleCalendar courses={schedule.courses} />
        </div>
      ))}
    </div>
  );
};

export default SavedSchedules;
