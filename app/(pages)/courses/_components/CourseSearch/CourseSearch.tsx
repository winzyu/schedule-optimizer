// app/(pages)/courses/_components/CourseSearch/CourseSearch.tsx
'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styles from './CourseSearch.module.scss';

const GET_COURSES = gql`
  query GetCourses($search: CourseSearchInput!) {
    courses(search: $search) {
      id
      subjectCode
      courseNumber
      title
    }
  }
`;

export default function CourseSearch() {
  const [subjectCode, setSubjectCode] = useState('CHE');
  const [courseNumber, setCourseNumber] = useState('1A');

  const { loading, error, data } = useQuery(GET_COURSES, {
    variables: {
      search: {
        subjectCode,
        courseNumber,
      },
    },
    onError: (error) => {
      console.log('GraphQL error:', {
        message: error.message,
        networkError: error.networkError,
        graphQLErrors: error.graphQLErrors,
      });
    },
    onCompleted: (data) => {
      console.log('GraphQL response:', data);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
          placeholder="Subject Code (e.g., CHEM)"
          className={styles.input}
        />
        <input
          type="text"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
          placeholder="Course Number (e.g., 1A)"
          className={styles.input}
        />
      </div>

      {data?.courses && (
        <div className={styles.courseGrid}>
          {data.courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h3>
                {course.subjectCode} {course.courseNumber}
              </h3>
              <p>{course.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
