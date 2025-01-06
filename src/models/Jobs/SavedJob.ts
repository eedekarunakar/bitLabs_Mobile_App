// /src/Types/jobTypes.ts
export interface Skill {
    skillName: string;
  }
  
  export interface JobData1 {
    id: number;
    companyname: string;
    jobTitle: string;
    location: string;
    employeeType: string;
    minimumExperience: number;
    maximumExperience: number;
    minSalary: number;
    maxSalary: number;
    creationDate: [number, number, number]; // [Year, Month, Day]
    skillsRequired: Skill[];
    jobStatus: string;
    logoFile: string | null;
  }
  