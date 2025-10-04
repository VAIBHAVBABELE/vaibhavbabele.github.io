// Firebase Configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyC5Qd9PAtrFrrko2GBl5Wu65yE0s6a0eGU",
    authDomain: "project-7a943.firebaseapp.com",
    projectId: "project-7a943",
    storageBucket: "project-7a943.firebasestorage.app",
    messagingSenderId: "163361864846",
    appId: "1:163361864846:web:965c4104772d31c9925ddf",
    measurementId: "G-DMRSSSDQ9P"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export Firebase services
window.firebase = {
    auth,
    db,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    googleProvider
};

// Auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User signed in:', user.email);
        window.currentUser = user;
        updateAuthUI(true, user);
    } else {
        // User is signed out
        console.log('User signed out');
        window.currentUser = null;
        updateAuthUI(false);
    }
});

// Update UI based on auth state
function updateAuthUI(isSignedIn, user = null) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isSignedIn && user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userEmail) userEmail.textContent = user.email;
        
        // Show user-specific content
        showUserContent();
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        // Hide user-specific content
        hideUserContent();
    }
}

// Show user-specific content
function showUserContent() {
    const userOnlyElements = document.querySelectorAll('.user-only');
    userOnlyElements.forEach(element => {
        element.style.display = 'block';
    });
}

// Hide user-specific content
function hideUserContent() {
    const userOnlyElements = document.querySelectorAll('.user-only');
    userOnlyElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Authentication functions
window.authFunctions = {
    // Sign up with email and password
    async signUp(email, password, displayName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Create user profile in Firestore using the user's UID as document ID
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            return { success: true, user: user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update last login time
            const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    lastLogin: new Date().toISOString()
                });
            }
            
            return { success: true, user: user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if user exists in Firestore
            const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
            const userSnapshot = await getDocs(userQuery);
            
            if (userSnapshot.empty) {
                // Create new user profile
                await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
            } else {
                // Update last login
                const userDoc = userSnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    lastLogin: new Date().toISOString()
                });
            }
            
            return { success: true, user: user };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Database functions
window.dbFunctions = {
    // Add document to collection
    async addDocument(collectionName, data) {
        try {
            if (!window.currentUser?.uid) {
                return { success: false, error: 'User not authenticated' };
            }
            
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                userId: window.currentUser.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Add document error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get documents from collection
    async getDocuments(collectionName, userId = null) {
        try {
            if (!window.currentUser?.uid && !userId) {
                return { success: false, error: 'User not authenticated' };
            }
            
            let q = collection(db, collectionName);
            const targetUserId = userId || window.currentUser.uid;
            
            q = query(q, where('userId', '==', targetUserId));
            q = query(q, orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            const documents = [];
            
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: documents };
        } catch (error) {
            console.error('Get documents error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update document
    async updateDocument(collectionName, docId, data) {
        try {
            if (!window.currentUser?.uid) {
                return { success: false, error: 'User not authenticated' };
            }
            
            await updateDoc(doc(db, collectionName, docId), {
                ...data,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Update document error:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete document
    async deleteDocument(collectionName, docId) {
        try {
            if (!window.currentUser?.uid) {
                return { success: false, error: 'User not authenticated' };
            }
            
            await deleteDoc(doc(db, collectionName, docId));
            return { success: true };
        } catch (error) {
            console.error('Delete document error:', error);
            return { success: false, error: error.message };
        }
    },

    // Listen to real-time updates
    listenToCollection(collectionName, callback, userId = null) {
        if (!window.currentUser?.uid && !userId) {
            console.error('User not authenticated for real-time updates');
            return null;
        }
        
        let q = collection(db, collectionName);
        const targetUserId = userId || window.currentUser.uid;
        
        q = query(q, where('userId', '==', targetUserId));
        q = query(q, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            callback(documents);
        });
    }
};

// Utility functions
window.utils = {
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // Check if user is authenticated
    isAuthenticated() {
        return window.currentUser !== null;
    },

    // Get current user
    getCurrentUser() {
        return window.currentUser;
    },

    // Require authentication
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.utils.showNotification('Please login to access this feature', 'warning');
            showLoginModal();
            return false;
        }
        return true;
    }
};

console.log('Firebase initialized successfully!');
