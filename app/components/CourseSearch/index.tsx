// app/components/CourseSearch/index.tsx
import React, { useState, useCallback } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { TEST_USER_ID } from '@/lib/constants';
import dynamic from 'next/dynamic';
import SearchForm from './SearchForm';
import CourseList from './CourseList';

// Import WeeklyCalendar with SSR disabled
const WeeklyCalendar = dynamic(() => import('./WeeklyCalendar'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />
  ),
});

const SEARCH_COURSES = gql`
  query SearchCourses($search: CourseSearchInput!) {
    courses(search: $search) {
      id
      crn
      subjectCode
      courseNumber
      sectionCode
      title
      units
      instructor
      description
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

const SAVE_COURSE = gql`
  mutation SaveCourse($userId: String!, $courseId: String!) {
    saveCourse(userId: $userId, courseId: $courseId) {
      id
      crn
      subjectCode
      courseNumber
      title
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

const REMOVE_COURSE = gql`
  mutation RemoveSavedCourse($userId: String!, $courseId: String!) {
    removeSavedCourse(userId: $userId, courseId: $courseId)
  }
`;

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

const CoursePreview = ({ course, onSave, onRemove, isSaved }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Course Preview</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {course.subjectCode} {course.courseNumber}
        </h3>
        <p className="text-gray-600">{course.title}</p>
        <p className="text-sm text-gray-500">
          {course.instructor} • {course.units} units
        </p>
      </div>

      <div className="mb-4">
        {course.meetings?.map((meeting, index) => (
          <div key={index} className="text-sm text-gray-600 mb-2">
            <div className="font-medium">{meeting.type}</div>
            <div>{meeting.days} • {meeting.time}</div>
            <div>{meeting.location}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <WeeklyCalendar selectedCourses={[course]} />
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

const CourseSearch = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);

  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery(SEARCH_COURSES, {
    variables: {
      search: {
        subjectCode: subjectCode.toUpperCase(),
        courseNumber,
      },
    },
    skip: !searchInitiated,
  });

  const { data: savedCoursesData, refetch: refetchSavedCourses } = useQuery(
    GET_SAVED_COURSES,
    {
      variables: { userId: TEST_USER_ID },
    }
  );

  const [saveCourse] = useMutation(SAVE_COURSE, {
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const [removeCourse] = useMutation(REMOVE_COURSE, {
    onError: (error) => {
      console.error('Remove course error:', error);
    }
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearchInitiated(true);
  }, []);

  const handleSaveCourse = async (course) => {
    try {
      await saveCourse({
        variables: {
          userId: TEST_USER_ID,
          courseId: course.id,
        },
      });
      await refetchSavedCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleRemoveCourse = async (course) => {
    try {
      await removeCourse({
        variables: {
          userId: TEST_USER_ID,
          courseId: course.id,
        },
      });
      await refetchSavedCourses();
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  const savedCourses = savedCoursesData?.savedCourses || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <SearchForm
            subjectCode={subjectCode}
            courseNumber={courseNumber}
            onSubjectCodeChange={setSubjectCode}
            onCourseNumberChange={setCourseNumber}
            onSubmit={handleSearch}
          />

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <CourseList
              courses={searchData?.courses || []}
              savedCourses={savedCourses}
              onCourseSelect={handleSaveCourse}
              onCourseRemove={handleRemoveCourse}
              onCoursePreview={setPreviewCourse}
              loading={searchLoading}
              error={searchError}
            />
          </div>

          {savedCourses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Saved Courses ({savedCourses.length})
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {savedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex justify-between items-center py-2 cursor-pointer"
                    onClick={() => setPreviewCourse(course)}
                  >
                    <div>
                      <span className="font-medium">
                        {course.subjectCode} {course.courseNumber}
                      </span>
                      <span className="text-gray-600 ml-2">{course.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCourse(course);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 sticky top-4">
          <CoursePreview
            course={previewCourse}
            onSave={handleSaveCourse}
            onRemove={handleRemoveCourse}
            isSaved={savedCourses.some(c => c.id === previewCourse?.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;