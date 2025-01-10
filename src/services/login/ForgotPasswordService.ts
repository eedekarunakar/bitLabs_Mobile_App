import axios from 'axios';
import { AuthResponse } from './Authservice';
import API_BASE_URL from '../API_Service';
const secretkey = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
const encryptPassword = (password: string, secretkey: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV (16 bytes for AES)
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(secretkey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString();
  return {encryptedPassword, iv: iv.toString(CryptoJS.enc.Base64)};
};

const sendOtp = async (forgotemail :string ): Promise<AuthResponse> => {
  const lowercaseEmail = forgotemail.toLowerCase();
  try {
    const response = await axios.post(`${API_BASE_URL}/applicant/forgotpasswordsendotp`, {
     email:lowercaseEmail
    });
    console.log(response)
    if (response.status === 200) {
      return { success: true, message: 'OTP sent to your email!' };
    } else {
      return { success: false, message: response.data };
    }
  } catch (error) {
    return { success: false, message: 'Error sending OTP. Please try again.' };
  }
};

const verifyOtp = async(otp:string,signupEmail:string ): Promise<AuthResponse> => {
     try {
        const response = await axios.post(
          `${API_BASE_URL}/applicant/applicantverify-otp`,
          {
            otp: otp,
            email: signupEmail,
          },
        );
        console.log(response)
       
        return { success: true, data: response.data };
       
    }catch(error){
        if(axios.isAxiosError(error)){
            return{ success: false, data: error.response?.data };
        }
        return{success:false}
    }
     
};

const resetPassword = async (email:string,password:string,confirmedPassword:string):Promise<AuthResponse> => {
  try {
    // const {encryptedPassword,iv} = encryptPassword(password,secretkey)
    const response = await axios.post(
        `${API_BASE_URL}/applicant/applicantreset-password/${email}`,
        {  password,
           confirmedPassword
           
          
        },
      );
      console.log('this hass hit the api')
      console.log(response)
     
        return { success: true, data: response.data };
      
    
  } catch (error) {
    if(axios.isAxiosError(error)){
      console.log('axois error')
    return { success: false, data: error.response?.data};
    }
    console.log('not axois error, but error...')
    return { success: false, message:'error'}
  }
};

export { sendOtp, verifyOtp, resetPassword };