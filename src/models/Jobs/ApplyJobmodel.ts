// /src/Types/jobTypes.ts

export type RootStackParamList = {
  Home: undefined;
  JobDetails: { job: JobData }; // Define the Job type as per your data structure
};

export interface JobData {
    id: number;
    companyname: string;
    jobTitle: string;
    location: string;
    employeeType: string;
    applyJobId:number;
    minimumExperience: number;
    maximumExperience: number;
    minSalary: number;
    maxSalary: number;
    creationDate: [number, number, number]; // [Year, Month, Day]
    skillsRequired: { skillName: string }[];
    jobStatus: string;
    logoFile: string | null;
    description: string;
    matchPercentage: number;
    matchStatus: string;
    sugesstedCourses: string[];
    matchedSkills :string[];
  }
  

 