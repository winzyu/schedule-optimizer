export interface Meeting {
    id: string;
    time: string;
    days: string;
    type: string;
    location: string;
}

export interface Course {
    id: string;
    crn: string;
    subjectCode: string;
    courseNumber: string;
    sectionCode: string;
    title: string;
    units: number;
    instructor: string;
    meetings: Meeting[];
}

export interface Schedule {
    id: string;
    name: string;
    courses: Course[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateScheduleInput {
    name: string;
    courseIds: string[];
    userId: string;
}

export interface UpdateScheduleInput {
    id: string;
    name?: string;
    courseIds?: string[];
}