import Schedules from '../_services/Schedules.js';
import Users from '../_services/Users.js';

const resolvers = {
  Schedule: {
    user: ({ userId }) => Users.find({ id: userId }),
    courses: ({ id }) => Schedules.getCourses({ id }),
  },
  Query: {
    schedule: (_, { id }) => Schedules.find({ id }),
    schedules: () => Schedules.findAll(),
    mySchedules: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Schedules.findByUser({ userId: user.id });
    },
  },
  Mutation: {
    createSchedule: (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Schedules.create({ userId: user.id, input });
    },
    addCourseToSchedule: async (_, { scheduleId, courseId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const schedule = await Schedules.find({ id: scheduleId });
      if (schedule.userId !== user.id) throw new Error('Not authorized');
      return Schedules.addCourse({ scheduleId, courseId });
    },
    removeCourseFromSchedule: async (_, { scheduleId, courseId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const schedule = await Schedules.find({ id: scheduleId });
      if (schedule.userId !== user.id) throw new Error('Not authorized');
      return Schedules.removeCourse({ scheduleId, courseId });
    },
    deleteSchedule: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const schedule = await Schedules.find({ id });
      if (schedule.userId !== user.id) throw new Error('Not authorized');
      return Schedules.delete({ id });
    },
  },
};

export default resolvers;
