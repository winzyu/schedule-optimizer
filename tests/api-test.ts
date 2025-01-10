// tests/api-test.ts
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
const crossFetch = require('cross-fetch');

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
  fetch: crossFetch,
});

// Helper function to pretty print nested objects
const prettyPrint = (obj: Object): string => {
  return JSON.stringify(obj, null, 2);
};

// GraphQL Queries and Mutations
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      schedules {
        id
        name
      }
    }
  }
`;

const SEARCH_COURSES = gql`
  query SearchCourses($search: CourseSearchInput!) {
    courses(search: $search) {
      id
      subjectCode
      courseNumber
      title
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

const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($input: CreateScheduleInput!) {
    createSchedule(input: $input) {
      id
      name
      courses {
        id
        subjectCode
        courseNumber
        title
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
        subjectCode
        courseNumber
        title
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

const GET_SCHEDULE = gql`
  query GetSchedule($id: ID!) {
    schedule(id: $id) {
      id
      name
      courses {
        id
        subjectCode
        courseNumber
        title
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

const GET_USER_SCHEDULES = gql`
  query GetUserSchedules($userId: String!) {
    schedules(userId: $userId) {
      id
      name
      courses {
        id
        subjectCode
        courseNumber
        title
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

async function runTests() {
  try {
    console.log('Starting API tests...\n');

    // 1. Create a test user
    const userResult = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          password: 'testpassword123',
        },
      },
    });

    const userId = userResult.data.createUser.id;
    console.log(
      '1. Created test user:',
      prettyPrint(userResult.data.createUser),
      '\n'
    );

    // 2. Query the created user
    const userQueryResult = await client.query({
      query: GET_USER,
      variables: { id: userId },
    });
    console.log(
      '2. Retrieved user:',
      prettyPrint(userQueryResult.data.user),
      '\n'
    );

    // 3. Search for ECS courses (both 36A and 36B)
    const coursesResult = await client.query({
      query: SEARCH_COURSES,
      variables: {
        search: {
          subjectCode: 'ECS',
          courseNumber: '36A',
        },
      },
    });
    console.log(
      '3. Found ECS 36A courses:',
      prettyPrint(coursesResult.data.courses),
      '\n'
    );

    const coursesResult2 = await client.query({
      query: SEARCH_COURSES,
      variables: {
        search: {
          subjectCode: 'ECS',
          courseNumber: '36B',
        },
      },
    });
    console.log(
      '4. Found ECS 36B courses:',
      prettyPrint(coursesResult2.data.courses),
      '\n'
    );

    // Get course IDs for testing
    const course1Id = coursesResult.data.courses[0].id;
    const course2Id = coursesResult2.data.courses[0].id;

    // 5. Create a schedule with the first course
    const scheduleResult = await client.mutate({
      mutation: CREATE_SCHEDULE,
      variables: {
        input: {
          name: 'Test Schedule',
          userId: userId,
          courseIds: [course1Id],
        },
      },
    });
    const scheduleId = scheduleResult.data.createSchedule.id;
    console.log(
      '5. Created schedule with first course:',
      prettyPrint(scheduleResult.data.createSchedule),
      '\n'
    );

    // 6. Update schedule - add second course
    const updateResult = await client.mutate({
      mutation: UPDATE_SCHEDULE,
      variables: {
        input: {
          id: scheduleId,
          courseIds: [course1Id, course2Id],
        },
      },
    });
    console.log(
      '6. Updated schedule with second course:',
      prettyPrint(updateResult.data.updateSchedule),
      '\n'
    );

    // 7. Update schedule - remove first course
    const removeResult = await client.mutate({
      mutation: UPDATE_SCHEDULE,
      variables: {
        input: {
          id: scheduleId,
          courseIds: [course2Id],
        },
      },
    });
    console.log(
      '7. Updated schedule (removed first course):',
      prettyPrint(removeResult.data.updateSchedule),
      '\n'
    );

    // 8. Update schedule name
    const renameResult = await client.mutate({
      mutation: UPDATE_SCHEDULE,
      variables: {
        input: {
          id: scheduleId,
          name: 'Renamed Test Schedule',
        },
      },
    });
    console.log(
      '8. Updated schedule name:',
      prettyPrint(renameResult.data.updateSchedule),
      '\n'
    );

    // 9. Get all user schedules
    const userSchedulesResult = await client.query({
      query: GET_USER_SCHEDULES,
      variables: { userId: userId },
    });
    console.log(
      '9. Retrieved user schedules:',
      prettyPrint(userSchedulesResult.data.schedules),
      '\n'
    );

    // 10. Delete the schedule
    const deleteResult = await client.mutate({
      mutation: DELETE_SCHEDULE,
      variables: { id: scheduleId },
    });
    console.log(
      '10. Deleted schedule:',
      deleteResult.data.deleteSchedule,
      '\n'
    );

    // 11. Verify schedule deletion
    const finalSchedulesResult = await client.query({
      query: GET_USER_SCHEDULES,
      variables: { userId: userId },
    });
    console.log(
      '11. Final user schedules:',
      prettyPrint(finalSchedulesResult.data.schedules),
      '\n'
    );

    console.log('All tests completed successfully!');
  } catch (err) {
    const error = err as any;
    console.error('Test failed:', error);

    if (error.networkError) {
      console.error(
        'Network error details:',
        error.networkError.result?.errors || error.networkError.message
      );
    }

    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
  }
}

// Run the tests
runTests();
