import { useState, useEffect } from 'react';

const useOtpManager = () => {
  const [otp, setOtp] = useState('');
  const [otpReceived, setOtpReceived] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isOtpValid, setOtpValid] = useState(true);


  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (otpReceived && !isOtpExpired) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsOtpExpired(true);
            clearInterval(countdown);
            setTimer(0);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpReceived, isOtpExpired]);



  return {
    otp,
    setOtp,
    otpReceived,
    setOtpReceived,
    isOtpExpired,
    setIsOtpExpired,
    timer,
    setTimer,
    isOtpValid,
    setOtpValid,
    
    
  };
};

export default useOtpManager;