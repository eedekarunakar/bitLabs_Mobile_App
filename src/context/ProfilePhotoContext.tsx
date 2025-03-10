import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ProfileService from '../services/profile/ProfileService';
import { AuthContext, useAuth } from './Authcontext';
 
interface ProfilePhotoContextProps {
    photo: string | null;
    fetchProfilePhoto: (userToken: string | null, userId: number | null) => Promise<void>;
}
 
interface ProfilePhotoProviderProps {
    children: ReactNode; // Define the type for children
}
 
const ProfilePhotoContext = createContext<ProfilePhotoContextProps | undefined>(undefined);
 
export const ProfilePhotoProvider: React.FC<ProfilePhotoProviderProps> = ({ children }) => {
    const [photo, setPhoto] = useState<string | null>(null);
    const {userToken,userId} = useAuth();
    const fetchProfilePhoto = async (token: string | null, id: number | null) => {
        if (!token || !id) return;
        try {
            const result = await ProfileService.fetchProfilePhoto(token, id);
            if (result.success && result.photoUrl) {
                setPhoto(result.photoUrl);
            }
        } catch (error) {
            console.error('Error fetching profile photo:', error);
        }
    };
 
    useEffect(() => {
        fetchProfilePhoto(userToken, userId);
    }, [userToken, userId]);
 
    return (
        <ProfilePhotoContext.Provider value={{ photo, fetchProfilePhoto }}>
            {children}
        </ProfilePhotoContext.Provider>
    );
};
 
export const useProfilePhoto = () => {
    const context = useContext(ProfilePhotoContext);
    if (!context) {
        throw new Error('useProfilePhoto must be used within a ProfilePhotoProvider');
    }
    return context;
};