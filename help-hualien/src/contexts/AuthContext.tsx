'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';

interface UserProfile {
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  hasProfile: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: true,
  hasProfile: false,
  logout: async () => { },
  refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      setProfileLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch('https://help-hualien-api.cthua.io/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.name && result.data.phone) {
          setUserProfile({
            name: result.data.name,
            phone: result.data.phone
          });
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('載入用戶資料失敗:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      user?.getIdToken().then(token => {
        console.log(token);
      });
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const hasProfile = userProfile !== null && userProfile.name && userProfile.phone;

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    hasProfile,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
};