// firebaseAuth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
  limit
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC7RgiZIIugvmMAyF8TwjUP1-1LKSDDwb4",
  authDomain: "code-list-pdc.firebaseapp.com",
  projectId: "code-list-pdc",
  storageBucket: "code-list-pdc.firebasestorage.app",
  messagingSenderId: "313665311782",
  appId: "1:313665311782:web:b7115264dd60aeb6be82e7"
};


class FirebaseAuthHandler {
  constructor(config = firebaseConfig) {

    try {
      // Initialize Firebase
      this.app = initializeApp(config);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.googleProvider = new GoogleAuthProvider();

      // Configure Google provider
      this.googleProvider.addScope('email');
      this.googleProvider.addScope('profile');
      this.googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      // Bind methods to preserve context
      this.onAuthStateChange = this.onAuthStateChange.bind(this);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw new Error('Failed to initialize Firebase');
    }
  }

  // 1. Enhanced Gmail login with better error handling
  async loginWithGmail() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;

      // Save/update user data in Firestore
      await this.saveUserToFirestore(user, { loginMethod: 'google' });

      return {
        success: true,
        user: this.formatUserData(user),
        message: 'Successfully logged in with Gmail'
      };
    } catch (error) {
      console.error('Gmail login error:', error);

      let errorMessage = 'Failed to login with Gmail';
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login cancelled by user';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account exists with different login method';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Unknown error occurred';
      }

      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // 2. Enhanced email/password login
  async loginWithEmail(email, password) {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email.trim().toLowerCase(),
        password
      );
      const user = userCredential.user;

      // Update last login time
      await this.updateUserLastLogin(user.uid);

      return {
        success: true,
        user: this.formatUserData(user),
        message: 'Successfully logged in'
      };
    } catch (error) {
      console.error('Email login error:', error);

      let errorMessage = 'Login failed';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = 'Login failed. Please try again';
      }

      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // 3. Register new user with email/password
  async registerWithEmail(email, password, displayName = '') {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email.trim().toLowerCase(),
        password
      );
      const user = userCredential.user;

      // Update display name if provided
      if (displayName.trim()) {
        await updateProfile(user, {
          displayName: displayName.trim()
        });
      }

      // Save user to Firestore
      await this.saveUserToFirestore(user, {
        displayName: displayName.trim(),
        loginMethod: 'email'
      });

      return {
        success: true,
        user: this.formatUserData(user),
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = 'Registration failed. Please try again';
      }

      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // 4. Get all registered users with pagination and filtering
  async getAllRegisteredEmails(limitNumber = 50, startAfter = null, roleFilter = null) {
    try {
      const usersRef = collection(this.db, 'users');
      let q = query(usersRef, orderBy('createdAt', 'desc'));

      // Add role filter if specified
      if (roleFilter) {
        q = query(q, where('role', '==', roleFilter));
      }

      // Add pagination if startAfter is provided
      if (startAfter) {
        q = query(q, startAfter(startAfter));
      }

      // Limit results
      if (limitNumber) {
        q = query(q, limit(limitNumber));
      }

      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email,
          displayName: userData.displayName || '',
          photoURL: userData.photoURL || '',
          role: userData.role || 'user',
          loginMethod: userData.loginMethod || 'unknown',
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin,
          isActive: userData.isActive !== false
        });
      });

      return {
        success: true,
        users: users,
        count: users.length,
        message: `Successfully retrieved ${users.length} users`
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch users'
      };
    }
  }


  // 5. Enhanced user role management
  async setUserRole(uid, role, updatedBy = null) {
    try {
      if (!uid || !role) {
        return {
          success: false,
          message: 'User ID and role are required'
        };
      }

      const validRoles = ['user', 'admin', 'contributor', 'monitor'];
      if (!validRoles.includes(role)) {
        return {
          success: false,
          message: 'Invalid role. Valid roles: ' + validRoles.join(', ')
        };
      }

      const userRef = doc(this.db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const updateData = {
        role: role,
        updatedAt: serverTimestamp()
      };

      if (updatedBy) {
        updateData.roleUpdatedBy = updatedBy;
      }

      await updateDoc(userRef, updateData);

      return {
        success: true,
        message: `User role successfully changed to ${role}`
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user role'
      };
    }
  }

  // 6. Get user role and data
  async getUserRole(uid) {
    try {
      if (!uid) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      const userRef = doc(this.db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          success: true,
          role: userData.role || 'user',
          userData: userData
        };
      } else {
        return {
          success: false,
          message: 'User not found'
        };
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user role'
      };
    }
  }

  // 7. Password reset
  async sendPasswordReset(email) {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required'
        };
      }

      await sendPasswordResetEmail(this.auth, email.trim().toLowerCase());

      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);

      let errorMessage = 'Failed to send password reset email';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
      }

      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // 8. Update user password
  async updateUserPassword(currentPassword, newPassword) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return {
          success: false,
          message: 'No user logged in'
        };
      }

      if (!currentPassword || !newPassword) {
        return {
          success: false,
          message: 'Current password and new password are required'
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          message: 'New password must be at least 6 characters long'
        };
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Password update error:', error);

      let errorMessage = 'Failed to update password';
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/weak-password':
          errorMessage = 'New password is too weak';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please log in again before changing password';
          break;
      }

      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // Helper: Save/update user in Firestore
  async saveUserToFirestore(user, additionalData = {}) {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        email: user.email,
        displayName: additionalData.displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: serverTimestamp(),
        isActive: true,
        ...additionalData
      };

      if (!userDoc.exists()) {
        // New user - set creation time and default role
        userData.createdAt = serverTimestamp();
        userData.role = additionalData.role || 'user';
      }

      await setDoc(userRef, userData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      return false;
    }
  }

  // Helper: Update last login time
  async updateUserLastLogin(uid) {
    try {
      const userRef = doc(this.db, 'users', uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Helper: Format user data consistently
  formatUserData(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous
    };
  }

  // 9. Enhanced logout
  async logout() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        // Update last logout time
        try {
          const userRef = doc(this.db, 'users', user.uid);
          await updateDoc(userRef, {
            lastLogout: serverTimestamp()
          });
        } catch (firestoreError) {
          console.warn('Could not update logout time:', firestoreError);
        }
      }

      await signOut(this.auth);
      return {
        success: true,
        message: 'Successfully logged out'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to logout'
      };
    }
  }

  // 10. Auth state monitoring
  onAuthStateChange(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    return onAuthStateChanged(this.auth, callback);
  }

  // 11. Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // 12. Check if user has specific role
  async hasRole(uid, requiredRole) {
    try {
      const roleResult = await this.getUserRole(uid);
      if (!roleResult.success) return false;

      const userRole = roleResult.role;
      const roleHierarchy = {
        'user': 1,
        'editor': 2,
        'moderator': 3,
        'admin': 4
      };

      return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // 13. Batch update multiple users
  async batchUpdateUsers(updates) {
    try {
      const batch = writeBatch(this.db);

      updates.forEach(update => {
        const userRef = doc(this.db, 'users', update.uid);
        batch.update(userRef, {
          ...update.data,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      return {
        success: true,
        message: `Successfully updated ${updates.length} users`
      };
    } catch (error) {
      console.error('Batch update error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update users'
      };
    }
  }
}

export default FirebaseAuthHandler;