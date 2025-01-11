// app/components/CourseSearch/SearchForm.tsx
import React from 'react';

interface SearchFormProps {
  subjectCode: string;
  courseNumber: string;
  onSubjectCodeChange: (value: string) => void;
  onCourseNumberChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = React.memo(
  ({
    subjectCode,
    courseNumber,
    onSubjectCodeChange,
    onCourseNumberChange,
    onSubmit,
  }: SearchFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Subject Code (e.g., ECS)"
            value={subjectCode}
            onChange={(e) => onSubjectCodeChange(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Course Number (e.g., 36)"
            value={courseNumber}
            onChange={(e) => onCourseNumberChange(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </form>
  )
);

SearchForm.displayName = 'SearchForm';
export default SearchForm;
