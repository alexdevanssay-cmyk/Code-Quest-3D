// Accounts and online copy of the progress, with Firebase (Authentication +
// Cloud Firestore). The Firebase library is loaded from Google's CDN only when
// a configuration is set (cloud-config.js): without one, nothing is loaded.
//
// Data: one document per account, progress/{uid} = { data: JSON text of the
// progress, updatedAt: ms, app: 'codequest3d' }. Only its owner can read or
// write it (firebase/firestore.rules).

import { FIREBASE_CONFIG } from './cloud-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';

export const cloudConfigured = () => !!FIREBASE_CONFIG?.apiKey;

let ready = null;

/** Loads Firebase once: resolves to the account and storage functions. */
export function cloud() {
  if (!cloudConfigured()) return Promise.reject(new Error('not configured'));
  ready ||= (async () => {
    const [{ initializeApp }, A, F] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`),
    ]);
    const app = initializeApp(FIREBASE_CONFIG);
    const auth = A.getAuth(app);
    const db = F.getFirestore(app);
    const ref = (uid) => F.doc(db, 'progress', uid);
    return {
      onUser: (fn) => A.onAuthStateChanged(auth, fn),
      user: () => auth.currentUser,
      signUp: (email, password) => A.createUserWithEmailAndPassword(auth, email, password),
      signIn: (email, password) => A.signInWithEmailAndPassword(auth, email, password),
      signInGoogle: () => A.signInWithPopup(auth, new A.GoogleAuthProvider()),
      resetPassword: (email) => A.sendPasswordResetEmail(auth, email),
      signOut: () => A.signOut(auth),
      async deleteAccount() {
        const u = auth.currentUser;
        if (!u) return;
        await F.deleteDoc(ref(u.uid));
        await A.deleteUser(u);
      },
      backend: {
        async getProgress(uid) {
          const snap = await F.getDoc(ref(uid));
          return snap.exists() ? snap.data() : null;
        },
        setProgress: (uid, data, updatedAt) => F.setDoc(ref(uid), { app: 'codequest3d', data, updatedAt }),
      },
    };
  })();
  ready.catch(() => { ready = null; }); // allow a retry after a network error
  return ready;
}

/** Message key (ui.js) of a Firebase error. */
export function cloudErrorKey(err) {
  const code = String(err?.code || '');
  const known = {
    'auth/email-already-in-use': 'acc.err.exists',
    'auth/invalid-email': 'acc.err.email',
    'auth/missing-email': 'acc.err.email',
    'auth/weak-password': 'acc.err.weak',
    'auth/missing-password': 'acc.err.weak',
    'auth/invalid-credential': 'acc.err.credentials',
    'auth/invalid-login-credentials': 'acc.err.credentials',
    'auth/wrong-password': 'acc.err.credentials',
    'auth/user-not-found': 'acc.err.credentials',
    'auth/too-many-requests': 'acc.err.tooMany',
    'auth/network-request-failed': 'acc.err.network',
    'auth/popup-closed-by-user': 'acc.err.popup',
    'auth/cancelled-popup-request': 'acc.err.popup',
    'auth/popup-blocked': 'acc.err.popupBlocked',
    'auth/unauthorized-domain': 'acc.err.domain',
    'auth/operation-not-allowed': 'acc.err.provider',
    'auth/requires-recent-login': 'acc.err.recent',
    'permission-denied': 'acc.err.rules',
    unavailable: 'acc.err.network',
  };
  return known[code] || (/Failed to fetch|import|network/i.test(String(err?.message)) ? 'acc.err.network' : 'acc.err.other');
}
