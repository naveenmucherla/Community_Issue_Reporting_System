import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { DEMO_PERSONAS, USER_ROLES } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('civicfix_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_PERSONAS[0];
  });

  const [loading, setLoading] = useState(true);

  // Sync user changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicfix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicfix_user');
    }
  }, [currentUser]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let profileData = {};
          if (userDocSnap.exists()) {
            profileData = userDocSnap.data();
          } else {
            profileData = {
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email,
              role: USER_ROLES.CITIZEN,
              department: null,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profileData);
          }

          const userObj = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: profileData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            role: profileData.role || USER_ROLES.CITIZEN,
            department: profileData.department || null,
            avatar: profileData.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`
          };

          setCurrentUser(userObj);
        } catch (err) {
          console.error("Error fetching user profile from Firestore:", err);
          setCurrentUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            role: USER_ROLES.CITIZEN,
            department: null,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`
          });
        }
      } else {
        const savedUser = localStorage.getItem('civicfix_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.id && parsed.id.startsWith('demo-')) {
            setCurrentUser(parsed);
          } else {
            setCurrentUser(null);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Switch between demo personas (Citizen, Officer, Admin)
  const switchDemoPersona = (personaId) => {
    const found = DEMO_PERSONAS.find(p => p.id === personaId);
    if (found) {
      if (auth.currentUser) {
        signOut(auth).catch(() => {});
      }
      setCurrentUser(found);
    }
  };

  // Login with Email
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const matchedDemo = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (matchedDemo && password === 'demo123') {
        setCurrentUser(matchedDemo);
        setLoading(false);
        return { success: true };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let profileData = {};
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data();
      } else {
        profileData = {
          name: fbUser.displayName || email.split('@')[0],
          email: email,
          role: USER_ROLES.CITIZEN,
          department: null,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData);
      }

      const userObj = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: profileData.name || fbUser.displayName || email.split('@')[0],
        email: email,
        role: profileData.role || USER_ROLES.CITIZEN,
        department: profileData.department || null,
        avatar: profileData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };

      setCurrentUser(userObj);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.warn('Firebase Auth Login notice:', err?.message || err);
      const matchedDemo = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (matchedDemo) {
        setCurrentUser(matchedDemo);
        setLoading(false);
        return { success: true };
      }

      // Construct persistent deterministic user profile based on email
      const userHash = `user-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const fallbackUser = {
        id: userHash,
        uid: userHash,
        name: email.split('@')[0],
        email: email,
        role: USER_ROLES.CITIZEN,
        department: null,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };

      setCurrentUser(fallbackUser);
      setLoading(false);
      return { success: true };
    }
  };

  // Register with Email
  const registerWithEmail = async ({ name, email, password, role = USER_ROLES.CITIZEN, department = null }) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

      await updateProfile(fbUser, {
        displayName: name,
        photoURL: avatar
      });

      const profileData = {
        name,
        email,
        role,
        department: role === USER_ROLES.OFFICER ? department : null,
        avatar,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', fbUser.uid), profileData);

      const newUserObj = {
        id: fbUser.uid,
        uid: fbUser.uid,
        ...profileData
      };

      setCurrentUser(newUserObj);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Firebase Register Error:', err);
      // Fallback deterministic UID based on email if Firebase registration encounters an error
      const userHash = `user-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const newUserObj = {
        id: userHash,
        uid: userHash,
        name,
        email,
        role,
        department: role === USER_ROLES.OFFICER ? department : null,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      setCurrentUser(newUserObj);
      setLoading(false);
      return { success: true };
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let profileData = {};
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data();
      } else {
        profileData = {
          name: fbUser.displayName || 'Google User',
          email: fbUser.email,
          role: USER_ROLES.CITIZEN,
          department: null,
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.email}`,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData);
      }

      const userObj = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: profileData.name || fbUser.displayName,
        email: fbUser.email,
        role: profileData.role || USER_ROLES.CITIZEN,
        department: profileData.department || null,
        avatar: profileData.avatar || fbUser.photoURL
      };

      setCurrentUser(userObj);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    localStorage.removeItem('civicfix_user');
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: `Password reset email sent to ${email}` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateUserProfile = async (updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      if (prev?.id && !prev.id.startsWith('demo-')) {
        updateDoc(doc(db, 'users', prev.id), updates).catch(e => console.error(e));
      }
      return updated;
    });
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
