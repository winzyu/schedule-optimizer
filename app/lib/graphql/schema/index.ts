// app/lib/graphql/schema/index.ts
import { mergeTypeDefs } from '@graphql-tools/merge';
import courseTypeDefs from './Course';
import meetingTypeDefs from './Meeting';
import scheduleTypeDefs from './Schedule';
import userTypeDefs from './User';
import scalarTypeDefs from './scalars';

const types = [
  scalarTypeDefs,
  courseTypeDefs,
  meetingTypeDefs,
  scheduleTypeDefs,
  userTypeDefs,
];
const typeDefs = mergeTypeDefs(types);

export default typeDefs;
