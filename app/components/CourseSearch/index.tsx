import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import WeeklyCalendar from './WeeklyCalendar';

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
  const [selectedCourses, setSelectedCourses] = useState([]);

  const { loading, error, data } = useQuery(SEARCH_COURSES, {
    variables: {
      search: {
        subjectCode: subjectCode.toUpperCase(),
        courseNumber: courseNumber,
      },
    },
    skip: !searchInitiated,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInitiated(true);
  };

  const handleCourseSelect = (course) => {
    // Check if course is already selected
    const isSelected = selectedCourses.some((c) => c.id === course.id);

    if (isSelected) {
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search and Results Column */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSearch} className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Subject Code (e.g., ECS)"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Course Number (e.g., 36)"
                  value={courseNumber}
                  onChange={(e) => setCourseNumber(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {loading && (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">Error: {error.message}</p>
              </div>
            )}

            {data?.courses && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  Found {data.courses.length} courses
                </h2>
                <div className="space-y-4">
                  {data.courses.map((course) => {
                    const isSelected = selectedCourses.some(
                      (c) => c.id === course.id
                    );

                    return (
                      <div
                        key={course.id}
                        className={`bg-white shadow-md rounded-lg p-6 transition-all
                          ${
                            isSelected
                              ? 'ring-2 ring-blue-500'
                              : 'hover:shadow-lg'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {course.subjectCode} {course.courseNumber}
                            </h3>
                            <p className="text-gray-600">{course.title}</p>
                          </div>
                          <button
                            onClick={() => handleCourseSelect(course)}
                            className={`px-4 py-2 rounded-full text-sm font-medium
                              ${
                                isSelected
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                          >
                            {isSelected ? 'Remove' : 'Add'}
                          </button>
                        </div>

                        {/* Course details... (keep existing details markup) */}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Calendar Column */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-bold mb-4">Weekly Schedule</h2>
          <WeeklyCalendar selectedCourses={selectedCourses} />

          {/* Selected Courses List */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Courses</h3>
            {selectedCourses.length === 0 ? (
              <p className="text-gray-500">No courses selected</p>
            ) : (
              <ul className="space-y-2">
                {selectedCourses.map((course) => (
                  <li
                    key={course.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>
                      {course.subjectCode} {course.courseNumber} -{' '}
                      {course.title}
                    </span>
                    <button
                      onClick={() => handleCourseSelect(course)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;
