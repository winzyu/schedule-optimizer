// app/components/CourseSearch/index.tsx
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { TEST_USER_ID } from '@/lib/constants';
import SearchForm from './SearchForm';
import CourseList from './CourseList';
import CoursePreview from './CoursePreview';
import SavedCoursesList from './SavedCoursesList';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchInitiated(true);
  };

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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Saved Courses ({savedCourses.length})
            </h2>
              <SavedCoursesList
              courses={savedCourses}
              onCourseRemove={handleRemoveCourse}
              onCoursePreview={setPreviewCourse}
            />
          </div>
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
