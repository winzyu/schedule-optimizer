import { mergeTypeDefs } from '@graphql-tools/merge';
import scalars from './scalars.js';
import User from './User.js';
import Course from './Course.js';
import Meeting from './Meeting.js';
import Schedule from './Schedule.js';

const types = [
  scalars,
  User,
  Course,
  Meeting,
  Schedule
];

const typeDefs = mergeTypeDefs(types);

export default typeDefs;
