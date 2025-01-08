// app/(api)/api/debug/route.ts
import Courses from '../../_datalib/_services/Courses.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const subjectCodes = await Courses.listAllSubjectCodes();
    const sampleCourses = {};

    for (const code of subjectCodes.slice(0, 3)) {
      // Get first 3 subject codes
      const courseNumbers = await Courses.listAllCourseNumbers(code);
      sampleCourses[code] = courseNumbers;
    }

    return NextResponse.json({
      availableSubjects: subjectCodes,
      sampleCourses,
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
