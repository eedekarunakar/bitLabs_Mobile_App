// src/models/Models.ts

export interface LoginErrors {
    username?: string;
    password?: string;
  }
  
  export interface SignupErrors {
    name?: string;
    email?: string;
    whatsappnumber?: string;
    password?: string;
    userRegistered?: string;
  }
  export interface ForgotErrors {
    email?:string;
    response?:string;
    password?:string;
    message?:string
  }

  export interface TestDetails {
    testName: string;
    testScore: number;
    testStatus: 'P' | 'F'; // Pass or Fail
    testDateTime: string; // ISO string format
    applicant: { id: number }; // Assuming applicant is an object with an id
  }
  export interface SkillBadge {
    id: number;
    name: string;
  }
  
 export interface ApplicantSkillBadge {
    flag: string;
    id: number;
    skillBadge: SkillBadge;
    status: string;
    testTaken: string;
  }
  export interface ProfileData {
    applicant: string;
    basicDetails: string;
    skillsRequired: Skill[];
    qualification: string;
    specialization: string;
    preferredJobLocations: string[];
    experience: string;
    applicantSkillBadges: ApplicantSkillBadge[];
  }

  export interface Skill {
     id: number;
      skillName: string;
    }
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
  export type JobDetails = {
    applyJobId: number;
    jobTitle: string;
    companyname: string;
    location: string;
    minimumExperience: number;
    maximumExperience: number;
    minSalary: number;
    maxSalary: number;
    employeeType: string;
    creationDate: [number, number, number];
  };
  // /src/Types/jobTypes.ts

export type RootStackParamList1 = {
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
    
  
    
    export interface JobCounts {
        recommendedJobs: number;
        appliedJobs: number;
        savedJobs: number;
      }
    
      export type RootStackParamList = {
        ForgotPassword: undefined;
        LandingPage: undefined;
        BottomTab: { shouldShowStep1: boolean; welcome: string } | undefined;
        Step1: { email: string | null };
        Step2: undefined;
        Step3: { updateShouldShowStep1: React.Dispatch<React.SetStateAction<boolean>> };
        TestInstruction: { testName: string };
        TestScreen: { questions: any[] };
        Jobs: { tab: 'recommended' | 'applied' | 'saved' };
        JobDetails: { job: any };
        JobDetailsScreen: { job: any };
        ViewJobDetails: { job: any };
        AppliedJobs: { job: any };
        SavedDetails: { job: any };
        SavedJobs: undefined;
        Profile: { retake?: boolean } | undefined;
        ImagePreview: { uri: string; retake?: boolean };
        passContent: { finalScore: number; testName: string };
        FailContent: undefined;
        TimeUp: undefined;
        Badges: { skillName: string; testType: string } | undefined;
        ChangePassword: undefined;
        Notification: undefined;
        ResumeBuilder: undefined;
        Home: { welcome: string } | undefined;
        Drives: undefined;
        'My Resume': undefined;
      };
     