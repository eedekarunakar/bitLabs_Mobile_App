import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import JobCard from './Jobcard'; // Import the JobCard component
import SkillMatchProbability from './Skillmatch'; // Import the SkillMatchProbability component
import SuggestedCourses from './Suggestedcourses'; // Import the SuggestedCourses component

type JobDetailsContentProps = {
  job: {
    jobTitle: string;
    companyname: string;
    location: string;
    minimumExperience: number;
    maximumExperience: number;
    minSalary: number;
    maxSalary: number;
    employeeType: string;
    creationDate: [number, number, number];
    description: string;
  };
  percent: number;
  skillProgressText: string | null;
  perfectMatchSkills: string[];
  unmatchedSkills: string[];
  suggestedCourses: string[];
};

const JobDetailsContent: React.FC<JobDetailsContentProps> = ({
  job,
  percent,
  skillProgressText,
  perfectMatchSkills,
  unmatchedSkills,
  suggestedCourses,
}) => {
  return (
    <ScrollView>
      <JobCard
        jobTitle={job.jobTitle}
        companyName={job.companyname}
        location={job.location}
        minExperience={job.minimumExperience}
        maxExperience={job.maximumExperience}
        minSalary={job.minSalary}
        maxSalary={job.maxSalary}
        employeeType={job.employeeType}
        creationDate={job.creationDate}
      />

      <SkillMatchProbability
        percent={percent}
        skillProgressText={skillProgressText}
        perfectMatchSkills={perfectMatchSkills}
        unmatchedSkills={unmatchedSkills}
      />

      <View style={styles.jobCard}>
        <Text style={styles.jobdestitle}>Full Job Description</Text>
        <Text style={styles.description}>
          {job.description.replace(/<[^>]+>/g, '')}
        </Text>
      </View>

      {suggestedCourses.length > 0 && (
        <SuggestedCourses suggestedCourses={suggestedCourses} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 12,
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  jobdestitle: {
    color: '#F46F16',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    flexShrink: 1,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

export default JobDetailsContent;