import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS, USER_ROLES } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize with Jane Citizen as default persona for smooth out-of-the-box experience
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('civicfix_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_PERSONAS[0];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicfix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicfix_user');
    }
  }, [currentUser]);

  // Switch between demo personas (Citizen, Officer, Admin) instantly
  const switchDemoPersona = (personaId) => {
    const found = DEMO_PERSONAS.find(p => p.id === personaId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Mock Login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      // Find matching demo user or construct citizen profile
      const matched = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: USER_ROLES.CITIZEN,
          department: null,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setCurrentUser(newUser);
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Mock Register
  const registerWithEmail = async ({ name, email, password, role = USER_ROLES.CITIZEN, department = null }) => {
    setLoading(true);
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        department: role === USER_ROLES.OFFICER ? department : null,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      setCurrentUser(newUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Google Login mock
  const loginWithGoogle = async () => {
    setLoading(true);
    const googleUser = {
      id: `google-user-${Date.now()}`,
      name: 'Google Verified Citizen',
      email: 'citizen.google@gmail.com',
      role: USER_ROLES.CITIZEN,
      department: null,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    setCurrentUser(googleUser);
    setLoading(false);
    return { success: true };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    return { success: true, message: `Password reset email sent to ${email}` };
  };

  const updateUserProfile = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || USER_ROLES.CITIZEN,
        loading,
        switchDemoPersona,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
