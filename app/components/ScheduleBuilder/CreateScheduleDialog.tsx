// components/ScheduleBuilder/CreateScheduleDialog.tsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($input: CreateScheduleInput!) {
    createSchedule(input: $input) {
      id
      name
      courses {
        id
        subjectCode
        courseNumber
        title
      }
    }
  }
`;

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onScheduleCreated: (schedule: any) => void;
}

const CreateScheduleDialog = ({ 
  open, 
  onOpenChange, 
  userId,
  onScheduleCreated 
}: CreateScheduleDialogProps) => {
  const [scheduleName, setScheduleName] = useState('');
  const [createSchedule, { loading }] = useMutation(CREATE_SCHEDULE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createSchedule({
        variables: {
          input: {
            name: scheduleName,
            userId: userId,
            courseIds: [] // Start with empty schedule
          }
        }
      });
      
      setScheduleName('');
      // Pass the newly created schedule back to the parent
      onScheduleCreated(result.data.createSchedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="scheduleName" 
              className="block text-sm font-medium text-gray-700"
            >
              Schedule Name
            </label>
            <input
              type="text"
              id="scheduleName"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter schedule name"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Create Schedule
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleDialog;
