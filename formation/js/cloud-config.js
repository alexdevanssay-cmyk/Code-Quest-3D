// Configuration of the online backup (accounts + saved progress), see
// formation/README.md, "Sauvegarde en ligne".
//
// null: no online backup, the progress stays in this browser only (the
// "Compte" page says so). To turn it on, paste here the object Firebase gives
// in Project settings -> Your apps -> SDK setup and configuration -> Config.
// These values are not secrets (every visitor's browser receives them): the
// access is protected by the rules of formation/firebase/firestore.rules.
export const FIREBASE_CONFIG = null;

// Example of what it looks like (fictitious values):
// export const FIREBASE_CONFIG = {
//   apiKey: 'AIzaSy…',
//   authDomain: 'code-quest-3d.firebaseapp.com',
//   projectId: 'code-quest-3d',
//   storageBucket: 'code-quest-3d.firebasestorage.app',
//   messagingSenderId: '123456789012',
//   appId: '1:123456789012:web:abc123def456',
// };
