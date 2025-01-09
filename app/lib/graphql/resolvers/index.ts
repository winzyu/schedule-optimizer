import { mergeResolvers } from '@graphql-tools/merge';
import Course from './Course';
import scalars from './scalars';

const resolvers = mergeResolvers([Course, scalars]);

export default resolvers;
