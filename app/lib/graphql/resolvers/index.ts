// app/lib/graphql/resolvers/index.ts
import { mergeResolvers } from '@graphql-tools/merge';
import Course from './Course';
import Schedule from './Schedule';
import User from './User';
import SavedCourses from './SavedCourses';
import scalars from './scalars';

const resolvers = mergeResolvers([
  Course,
  Schedule,
  User,
  SavedCourses,
  scalars,
]);

export default resolvers;
