// app/lib/services/scheduleOptimizer.ts

// Types for optimization
export interface OptimizationResult {
  schedule: Course[];
  score: number;
  metrics: {
    timePreference: number;
    compactness: number;
    daysOff: number;
    boundaryFit: number;
  }
}

// Utilities for schedule optimization
import type { Course, Meeting } from '@/types/schedule';

interface TimeSlot {
  startHour: number;
  endHour: number;
  days: string[];
}

interface ScheduleScore {
  schedule: Course[];
  score: number;
  metrics: {
    timePreference: number;
    compactness: number;
    daysOff: number;
    boundaryFit: number;
  }
}

// Convert time string (e.g., "3:10 PM") to decimal hours
const timeToDecimalHours = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours + minutes / 60;
};

// Check if two time slots overlap
const hasTimeConflict = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  // Check days overlap
  const commonDays = slot1.days.filter(day => slot2.days.includes(day));
  if (commonDays.length === 0) return false;

  // Check time overlap
  return !(slot1.endHour <= slot2.startHour || slot1.startHour >= slot2.endHour);
};

// Convert course meetings to time slots
const courseToTimeSlots = (course: Course): TimeSlot[] => {
  return course.meetings.map(meeting => ({
    startHour: timeToDecimalHours(meeting.time.split('-')[0].trim()),
    endHour: timeToDecimalHours(meeting.time.split('-')[1].trim()),
    days: meeting.days.split(',').map(d => d.trim())
  }));
};

// Check if a course conflicts with any courses in the schedule
const hasConflicts = (course: Course, schedule: Course[]): boolean => {
  const courseSlots = courseToTimeSlots(course);
  
  for (const existingCourse of schedule) {
    const existingSlots = courseToTimeSlots(existingCourse);
    
    for (const slot1 of courseSlots) {
      for (const slot2 of existingSlots) {
        if (hasTimeConflict(slot1, slot2)) return true;
      }
    }
  }
  
  return false;
};

// Generate all valid schedule combinations
const generateValidSchedules = (courses: Course[]): Course[][] => {
  const validSchedules: Course[][] = [];
  
  const buildSchedule = (
    currentSchedule: Course[], 
    remainingCourses: Course[]
  ) => {
    // Base case: if we've used all courses, add the schedule
    if (remainingCourses.length === 0) {
      validSchedules.push([...currentSchedule]);
      return;
    }
    
    // Try adding each remaining course
    for (let i = 0; i < remainingCourses.length; i++) {
      const course = remainingCourses[i];
      
      // Skip if course conflicts with current schedule
      if (hasConflicts(course, currentSchedule)) continue;
      
      // Add course and recurse
      currentSchedule.push(course);
      buildSchedule(
        currentSchedule,
        [...remainingCourses.slice(0, i), ...remainingCourses.slice(i + 1)]
      );
      currentSchedule.pop();
    }
  };

  buildSchedule([], courses);
  return validSchedules;
};

// Score a schedule based on preferences
const scoreSchedule = (
  schedule: Course[],
  preferences: OptimizationPreferences
): ScheduleScore => {
  let timePreference = 0;
  let compactness = 0;
  let daysOff = 0;
  let boundaryFit = 0;
  
  // Convert preferences to numeric hours
  const earliestAllowed = preferences.earliestTime ? 
    timeToDecimalHours(preferences.earliestTime + ' AM') : 8;
  const latestAllowed = preferences.latestTime ?
    timeToDecimalHours(preferences.latestTime + ' PM') : 21;

  // Get all time slots
  const allSlots = schedule.flatMap(courseToTimeSlots);
  
  // Score time preference (early vs late)
  if (preferences.preferenceType === 'EARLY') {
    timePreference = allSlots.reduce((score, slot) => 
      score + (21 - slot.startHour) / allSlots.length, 0);
  } else if (preferences.preferenceType === 'LATE') {
    timePreference = allSlots.reduce((score, slot) =>
      score + (slot.startHour - 8) / allSlots.length, 0);
  }

  // Score compactness
  if (preferences.preferenceType === 'COMPACT') {
    // Group by day and calculate gaps
    const daySlots = new Map<string, TimeSlot[]>();
    allSlots.forEach(slot => {
      slot.days.forEach(day => {
        if (!daySlots.has(day)) daySlots.set(day, []);
        daySlots.get(day)!.push(slot);
      });
    });
    
    let totalGaps = 0;
    daySlots.forEach(slots => {
      slots.sort((a, b) => a.startHour - b.startHour);
      for (let i = 1; i < slots.length; i++) {
        totalGaps += slots[i].startHour - slots[i-1].endHour;
      }
    });
    compactness = 1 / (1 + totalGaps);
  } else if (preferences.preferenceType === 'SPREAD') {
    // Similar logic but reward gaps
    const daySlots = new Map<string, TimeSlot[]>();
    allSlots.forEach(slot => {
      slot.days.forEach(day => {
        if (!daySlots.has(day)) daySlots.set(day, []);
        daySlots.get(day)!.push(slot);
      });
    });
    
    let totalSpread = 0;
    daySlots.forEach(slots => {
      slots.sort((a, b) => a.startHour - b.startHour);
      for (let i = 1; i < slots.length; i++) {
        totalSpread += Math.min(
          slots[i].startHour - slots[i-1].endHour,
          3 // Cap individual gaps at 3 hours
        );
      }
    });
    compactness = totalSpread / (daySlots.size * 3);
  }

  // Score days off
  const usedDays = new Set(allSlots.flatMap(slot => slot.days));
  const offDays = preferences.daysOff.filter(day => !usedDays.has(day));
  daysOff = offDays.length / preferences.daysOff.length;

  // Score boundary fit
  const withinBounds = allSlots.every(slot =>
    slot.startHour >= earliestAllowed && slot.endHour <= latestAllowed
  );
  boundaryFit = withinBounds ? 1 : 0;

  // Combine scores with weights
  const score = (
    timePreference * 0.3 +
    compactness * 0.3 +
    daysOff * 0.2 +
    boundaryFit * 0.2
  );

  return {
    schedule,
    score,
    metrics: {
      timePreference,
      compactness,
      daysOff,
      boundaryFit
    }
  };
};

// Main optimization function
export const optimizeSchedule = (
  courses: Course[],
  preferences: OptimizationPreferences,
  maxResults: number = 3
): ScheduleScore[] => {
  // Guard against empty course selection
  if (!courses.length || !preferences.selectedCourses.length) {
    return [{
      schedule: [],
      score: 0,
      metrics: {
        timePreference: 0,
        compactness: 0,
        daysOff: 0,
        boundaryFit: 0
      }
    }];
  }
  // Generate all valid combinations
  const validSchedules = generateValidSchedules(
    courses.filter(c => preferences.selectedCourses.includes(c.id))
  );
  
  // Score each schedule
  const scoredSchedules = validSchedules
    .map(schedule => scoreSchedule(schedule, preferences))
    .sort((a, b) => b.score - a.score);
  
  // Return top results
  return scoredSchedules.slice(0, maxResults);
};
