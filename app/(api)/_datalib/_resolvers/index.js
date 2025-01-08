import { mergeResolvers } from '@graphql-tools/merge';
import scalars from './scalars.js';
import User from './User.js';
import Course from './Course.js';
import Schedule from './Schedule.js';

const allResolvers = [];
const modules = [scalars, User, Course, Schedule];
modules.forEach((module) => {
  allResolvers.push(module);
});

const resolvers = mergeResolvers(allResolvers);
export default resolvers;
