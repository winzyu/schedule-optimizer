// app/(routes)/saved/page.tsx
'use client';

import SavedSchedules from '@/components/SavedSchedules';

export default function SavedSchedulesPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Schedules</h1>
        <a
          href="/schedule"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Schedule
        </a>
      </div>
      <SavedSchedules />
    </div>
  );
}
