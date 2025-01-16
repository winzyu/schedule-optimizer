import { mergeResolvers } from '@graphql-tools/merge';
import Course from './Course';
import Schedule from './Schedule';
import User from './User';
import SavedCourses from './SavedCourses';
import Auth from './Auth';
import scalars from './scalars';

const resolvers = mergeResolvers([
  Auth,
  Course,
  Schedule,
  User,
  SavedCourses,
  scalars,
]);

export default resolvers;
