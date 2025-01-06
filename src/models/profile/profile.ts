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
  
  