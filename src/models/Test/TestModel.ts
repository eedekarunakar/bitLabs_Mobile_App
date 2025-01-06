
export interface TestDetails {
    testName: string;
    testScore: number;
    testStatus: 'P' | 'F'; // Pass or Fail
    testDateTime: string; // ISO string format
    applicant: { id: number }; // Assuming applicant is an object with an id
  }
 
   