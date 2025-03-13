// useBadgeViewModel.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchTestStatus, fetchSkillBadges, calculateRetakeDate } from '@services/Home/BadgeService';
import { useAuth } from '@context/Authcontext';
 
export const useBadgeViewModel = () => {
  const { userId, userToken } = useAuth();
  const [selectedStep, setSelectedStep] = useState(1);
  const [timer, setTimer] = useState<null | { days: number, hours: number, minutes: number }>(null);
  const [timerState, setTimerState] = useState<any>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [testName, setTestName] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [applicantSkillBadges, setApplicantSkillBadges] = useState<any[]>([]);
 
  const startTimer = useCallback((retakeDate: Date, badgeId?: number) => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = retakeDate.getTime() - now.getTime();
 
      if (difference > 0) {
        const timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        };
 
        if (badgeId) {
          setTimerState((prevState: any) => ({
            ...prevState,
            [badgeId]: timeLeft,
          }));
        } else {
          setTimer(timeLeft);
          setIsButtonDisabled(true);
        }
      } else {
        if (badgeId) {
          setTimerState((prevState: any) => ({
            ...prevState,
            [badgeId]: null,
          }));
        } else {
          setTimer(null);
          setIsButtonDisabled(false);
        }
      }
    };
 
    calculateTimeLeft();
    return setInterval(calculateTimeLeft, 1000);
  }, []);
 
  const loadTestStatus = useCallback(async () => {
    try {
      const data = await fetchTestStatus(userId, userToken);

 
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(test => {
          if (!test.testName || test.testName.trim() === '') {
            test.testName = 'General Aptitude Test';
          }
        });
 
        const aptitudeTest = data.find(test => test.testName.toLowerCase().includes('aptitude'));
        const technicalTest = data.find(test => test.testName.toLowerCase().includes('technical'));
 
        if (aptitudeTest) {
          if (aptitudeTest.testStatus.toUpperCase() === 'P') {
            if (technicalTest) {
              if (technicalTest.testStatus.toUpperCase() === 'P') {
                setSelectedStep(3);
                setTestName('');
                setTestStatus('');
              } else {
                setSelectedStep(2);
                setTestName('Technical Test');
                setTestStatus(technicalTest.testStatus);
 
                const retakeDate = calculateRetakeDate(technicalTest.testDateTime);
                const timerInterval = startTimer(retakeDate);
 
                return () => clearInterval(timerInterval);
              }
            } else {
              setSelectedStep(2);
              setTestName('Technical Test');
              setTestStatus('');
            }
          } else {
            setSelectedStep(1);
            setTestName('General Aptitude Test');
            setTestStatus(aptitudeTest.testStatus);
 
            const retakeDate = calculateRetakeDate(aptitudeTest.testDateTime);
            const timerInterval = startTimer(retakeDate);
 
            return () => clearInterval(timerInterval);
          }
        } else {
          setSelectedStep(1);
          setTestName('General Aptitude Test');
          setTestStatus('');
        }
      }
    } catch (error) {
      setSelectedStep(1);
      setTestName('General Aptitude Test');
      console.error('Error fetching test status:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, userToken, startTimer]);
 
  const loadSkillBadges = useCallback(async () => {
    if (!userId || !userToken) {
      setLoading(false);
      return;
    }
 
    setLoading(true);
    try {
      const data = await fetchSkillBadges(userId, userToken);

      setApplicantSkillBadges(data);
    } catch (error) {
      console.error('Error fetching skill badges:', error);
    }
    setLoading(false);
  }, [userId, userToken]);
 
  useEffect(() => {
    loadTestStatus();
    loadSkillBadges();
  }, [loadTestStatus, loadSkillBadges]);
 
  useEffect(() => {
    applicantSkillBadges.forEach((badge: any) => {
      if (badge.status === 'FAILED') {
        const retakeDate = calculateRetakeDate(badge.testTaken);
        const timerInterval = startTimer(retakeDate, badge.skillBadge.id);
 
        return () => clearInterval(timerInterval);
      }
    });
  }, [applicantSkillBadges, startTimer]);
 
  return {
    selectedStep,
    timer,
    timerState,
    isButtonDisabled,
    testName,
    testStatus,
    loading,
    applicantSkillBadges,
    loadSkillBadges
  };
};