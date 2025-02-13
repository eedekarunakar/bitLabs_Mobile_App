import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as Keychain from 'react-native-keychain';
import { handleLogin ,handleLoginWithEmail,AuthResponse } from '../services/login/Authservice';
import { showToast } from '../services/login/ToastService';
import LogoutModal from '../screens/LandingPage/LogoutModel'; // Import the modal component


interface AuthContextProps {
  isAuthenticated: boolean;
  authData: { token: string; id: number; email: string } | null;
  login: (loginemail: string, loginpassword: string) => Promise<AuthResponse>;
  Glogin: (loginemail: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<{ token: string; id: number; email: string } | null>(null);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  

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

  const Glogin = async (loginemail: string): Promise<AuthResponse> => {
    const response = await handleLoginWithEmail(loginemail);
    
    if (response.success && typeof response.data === 'object') {
      const { token, id } = response.data;

      // Store credentials separately using Keychain
      await Keychain.setGenericPassword('user', JSON.stringify({ id, email: loginemail }), { service: 'userDetails' });
      await Keychain.setGenericPassword('auth', token, { service: 'authToken' });

      setAuthData({ token, id, email: loginemail });  // Update state with user info
      setIsAuthenticated(true); // Mark the user as signed in
    }
    return response;
  };


  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const hideLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const handleLogout = async () => {
    await Keychain.resetGenericPassword({ service: 'userDetails' });
    await Keychain.resetGenericPassword({ service: 'authToken' });
    setAuthData(null);
    setIsAuthenticated(false);
    showToast('success', 'Logout Successful');
    hideLogoutModal();
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
    <AuthContext.Provider value={{ isAuthenticated, authData, login,Glogin, logout: showLogoutModal }}>
      {children}
      <LogoutModal
        visible={isLogoutModalVisible}
        onCancel={hideLogoutModal}
        onConfirm={handleLogout}
      />
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  const { authData, ...rest } = context;

  const userId = authData?.id ?? null; // Extract userId from authData
  const userToken = authData?.token ?? null; // Extract userToken from authData
  const userEmail = authData?.email ?? null;
  return { ...rest, userId, userToken, userEmail };
};

export { AuthProvider, useAuth,AuthContext };
