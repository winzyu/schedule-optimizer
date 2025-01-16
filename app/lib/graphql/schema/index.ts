// app/lib/graphql/schema/index.ts
import { mergeTypeDefs } from '@graphql-tools/merge';
import courseTypeDefs from './Course';
import meetingTypeDefs from './Meeting';
import scheduleTypeDefs from './Schedule';
import userTypeDefs from './User';
import savedCoursesTypeDefs from './SavedCourses';
import scalarTypeDefs from './scalars';
import AuthTypeDefs from './Auth';

const types = [
  AuthTypeDefs,
  scalarTypeDefs,
  courseTypeDefs,
  meetingTypeDefs,
  scheduleTypeDefs,
  savedCoursesTypeDefs,
  userTypeDefs,
];
const typeDefs = mergeTypeDefs(types);

export default typeDefs;
