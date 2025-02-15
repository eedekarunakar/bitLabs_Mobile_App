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