import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

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
      geCourses
      finalExam
      dropDate
      openSeats
      reservedSeats
      waitlistSeats
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

  const { loading, error, data } = useQuery(SEARCH_COURSES, {
    variables: {
      search: {
        subjectCode: subjectCode.toUpperCase(),
        courseNumber: courseNumber,
      },
    },
    skip: !searchInitiated, // Only run query after search is initiated
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchInitiated(true);
    console.log('Search initiated with:', { subjectCode, courseNumber });
  };

  // Debug logging
  console.log('Component state:', { loading, error, data, searchInitiated });

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Subject Code (e.g., ECS)"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Course Number (e.g., 36A)"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching courses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">Error: {error.message}</p>
          </div>
        )}

        {data?.courses && data.courses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Found {data.courses.length} courses
            </h2>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {data.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {course.subjectCode} {course.courseNumber}
                      </h3>
                      <p className="text-gray-600">{course.title}</p>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      CRN: {course.crn}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instructor:</span>{' '}
                      {course.instructor}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Units:</span> {course.units}
                    </p>
                    {course.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      Meeting Times:
                    </h4>
                    <div className="space-y-2">
                      {course.meetings.map((meeting, index) => (
                        <div
                          key={meeting.id || index}
                          className="text-sm bg-gray-50 p-2 rounded"
                        >
                          <div className="flex justify-between">
                            <span>{meeting.type}</span>
                            <span>{meeting.days}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>{meeting.time}</span>
                            <span>{meeting.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {course.openSeats !== null && (
                    <div className="mt-4 flex space-x-4 text-sm">
                      <span className="text-green-600">
                        Open Seats: {course.openSeats}
                      </span>
                      {course.waitlistSeats !== null && (
                        <span className="text-yellow-600">
                          Waitlist: {course.waitlistSeats}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.courses && data.courses.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No courses found matching your search criteria.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CourseSearch;
