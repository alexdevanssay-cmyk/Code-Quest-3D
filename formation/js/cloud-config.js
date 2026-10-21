// Configuration of the online backup (accounts + saved progress), see
// formation/README.md, "Sauvegarde en ligne".
//
// Set to null for no online backup, the progress stays in this browser only (the
// "Compte" page says so). To turn it on, paste here the object Firebase gives
// in Project settings -> Your apps -> SDK setup and configuration -> Config.
// These values are not secrets (every visitor's browser receives them): the
// access is protected by the rules of formation/firebase/firestore.rules.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCqSRJraIZyvhgs7EYuL99r8iHICUAgXqk',
  authDomain: 'code-quest-3d-b725f.firebaseapp.com',
  projectId: 'code-quest-3d-b725f',
  storageBucket: 'code-quest-3d-b725f.firebasestorage.app',
  messagingSenderId: '1042083471057',
  appId: '1:1042083471057:web:49b3d9a3e652b8c7822ff0',
  measurementId: 'G-4EGW8PTWLR',
};

// Example of what it looks like (fictitious values):
// export const FIREBASE_CONFIG = {
//   apiKey: 'AIzaSy…',
//   authDomain: 'code-quest-3d.firebaseapp.com',
//   projectId: 'code-quest-3d',
//   storageBucket: 'code-quest-3d.firebasestorage.app',
//   messagingSenderId: '123456789012',
//   appId: '1:123456789012:web:abc123def456',
// };
