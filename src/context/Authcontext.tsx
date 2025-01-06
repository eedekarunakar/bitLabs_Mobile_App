import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as Keychain from 'react-native-keychain';
import { handleLogin } from '../services/login/Authservice';
import { AuthResponse } from '../services/login/Authservice';
 
interface AuthContextProps {
  isAuthenticated: boolean;
  authData: { token: string; id: number; email: string  } | null;
  login: (loginemail: string, loginpassword: string) => Promise<AuthResponse>;
  logout: () => void;
}
 
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
 
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<{ token: string; id: number; email: string } | null>(null);
 
  const login = async (loginemail: string, loginpassword: string): Promise<AuthResponse> => {
    const response = await handleLogin(loginemail, loginpassword);
    if (response.success && typeof response.data === 'object') {
      const { token, id } = response.data;
     
      // Store credentials separately
      await Keychain.setGenericPassword('user', JSON.stringify({ id, email: loginemail }), { service: 'userDetails' });
      await Keychain.setGenericPassword('auth', token, { service: 'authToken' });
   
      setAuthData({ token, id, email: loginemail });
      setIsAuthenticated(true);
    }
    return response;
  };
 
  const logout = async () => {
    await Keychain.resetGenericPassword({ service: 'userDetails' });
    await Keychain.resetGenericPassword({ service: 'authToken' });
    setAuthData(null);
    setIsAuthenticated(false);
  };
 
  const checkAuth = async () => {
    try {
      const userDetails = await Keychain.getGenericPassword({ service: 'userDetails' });
      const authToken = await Keychain.getGenericPassword({ service: 'authToken' });
 
      if (userDetails && authToken) {
        const parsedUserDetails = JSON.parse(userDetails.password);  // Parse user details stored as JSON
        setAuthData({
          id: parsedUserDetails.id,
          token: authToken.password,
          email: parsedUserDetails.email,
        });
        setIsAuthenticated(true);
      } else {
        setAuthData(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthData(null);
      setIsAuthenticated(false);
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);
 
  return (
<AuthContext.Provider value={{ isAuthenticated, authData, login, logout }}>
      {children}
</AuthContext.Provider>
  );
};
 
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  const { authData, ...rest } = context;

  const userId = authData?.id || null; // Extract userId from authData
  const userToken = authData?.token || null; // Extract userToken from authData
  const userEmail = authData?.email || null;
  return { ...rest, userId, userToken,userEmail };
};
 
export { AuthProvider, useAuth };