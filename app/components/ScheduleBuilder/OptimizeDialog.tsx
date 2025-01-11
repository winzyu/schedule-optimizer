// app/components/ScheduleBuilder/OptimizeDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Course } from '@/types/schedule';
import { optimizeSchedule, type OptimizationResult } from '@/lib/services/scheduleOptimizer';
import OptimizationResults from './OptimizationResults';

interface OptimizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onOptimize: (schedule: Course[]) => void;
}

const timeOptions = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const OptimizeDialog: React.FC<OptimizeDialogProps> = ({
  open,
  onOpenChange,
  courses,
  onOptimize,
}) => {
  const [step, setStep] = useState<'preferences' | 'results'>('preferences');
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [preferenceType, setPreferenceType] = useState<'EARLY' | 'LATE' | 'COMPACT' | 'SPREAD'>('EARLY');
  const [daysOff, setDaysOff] = useState<string[]>([]);
  const [earliestTime, setEarliestTime] = useState('08:00');
  const [latestTime, setLatestTime] = useState('18:00');

  const handleDayToggle = (day: string) => {
    setDaysOff(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);

    try {
      const preferences = {
        selectedCourses,
        preferenceType,
        daysOff,
        earliestTime,
        latestTime,
      };

      // Filter to only selected courses
      const selectedCoursesData = courses.filter(course => 
        preferences.selectedCourses.includes(course.id)
      );
      
      if (selectedCoursesData.length === 0) {
        throw new Error('Please select at least one course to optimize');
      }

      const results = optimizeSchedule(selectedCoursesData, preferences);
      setOptimizationResults(results);
      setStep('results');
    } catch (error) {
      console.error('Optimization error:', error);
      // TODO: Show error message to user
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleScheduleSelect = (result: OptimizationResult) => {
    onOptimize(result.schedule);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when dialog closes
    setTimeout(() => {
      setStep('preferences');
      setOptimizationResults([]);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'preferences' ? 'Optimize Schedule' : 'Optimization Results'}
          </DialogTitle>
        </DialogHeader>

        {step === 'preferences' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Courses to Optimize
              </label>
              <div className="space-y-2">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={(e) => {
                        setSelectedCourses(prev =>
                          e.target.checked
                            ? [...prev, course.id]
                            : prev.filter(id => id !== course.id)
                        );
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>
                      {course.subjectCode} {course.courseNumber} - {course.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optimization Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimization Preference
              </label>
              <select
                value={preferenceType}
                onChange={(e) => setPreferenceType(e.target.value as any)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="EARLY">Earliest Possible Classes</option>
                <option value="LATE">Latest Possible Classes</option>
                <option value="COMPACT">Most Compact Schedule</option>
                <option value="SPREAD">Most Spread Out Schedule</option>
              </select>
            </div>

            {/* Days Off Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Days Off
              </label>
              <div className="flex space-x-4">
                {['M', 'T', 'W', 'R', 'F'].map((day) => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={daysOff.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="rounded border-gray-300"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Earliest Class Time
                </label>
                <select
                  value={earliestTime}
                  onChange={(e) => setEarliestTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latest Class Time
                </label>
                <select
                  value={latestTime}
                  onChange={(e) => setLatestTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedCourses.length === 0 || isOptimizing}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOptimizing ? 'Optimizing...' : 'Optimize Schedule'}
              </button>
            </div>
          </form>
        ) : (
          <OptimizationResults
            results={optimizationResults}
            onScheduleSelect={handleScheduleSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OptimizeDialog;
