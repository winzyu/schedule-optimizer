import Courses from '../_services/Courses.js';

const resolvers = {
  Course: {
    meetings: ({ id }) => Courses.getMeetings({ id }),
    schedules: ({ id }) => Courses.getSchedules({ id }),
  },
  Query: {
    course: (_, { id }) => Courses.find({ id }),
    courses: (_, { search }) => Courses.findByCriteria(search),
  },
};

export default resolvers;
