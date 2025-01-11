// app/components/ScheduleBuilder/OptimizationResults.tsx
import React from 'react';
import type { OptimizationResult } from '@/lib/services/scheduleOptimizer';
import ScheduleCalendar from '../Calendar/ScheduleCalendar';

interface OptimizationResultsProps {
  results: OptimizationResult[];
  onScheduleSelect: (schedule: OptimizationResult) => void;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  results,
  onScheduleSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectedResult = results[selectedIndex] || {
    schedule: [],
    score: 0,
    metrics: {
      timePreference: 0,
      compactness: 0,
      daysOff: 0,
      boundaryFit: 0
    }
  };

  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Schedule Navigation */}
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedIndex === index
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Option {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => onScheduleSelect(selectedResult)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Apply This Schedule
        </button>
      </div>

      {/* Metrics Display */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(selectedResult.metrics).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="text-sm text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-lg font-semibold">
              {formatScore(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Preview */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Schedule Preview</h3>
        <ScheduleCalendar courses={selectedResult.schedule} />
      </div>
    </div>
  );
};

export default OptimizationResults;
