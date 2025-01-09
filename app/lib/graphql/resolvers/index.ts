// app/lib/graphql/resolvers/index.ts
import { mergeResolvers } from '@graphql-tools/merge';
import Course from './Course';
import Schedule from './Schedule';
import User from './User';
import scalars from './scalars';

const resolvers = mergeResolvers([Course, Schedule, User, scalars]);

export default resolvers;
