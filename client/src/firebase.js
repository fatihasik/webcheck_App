import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCHFPrt9nO34HYJAQwSY502D0yFcR7kwYE",
  authDomain: "etkbwebcheck.firebaseapp.com",
  projectId: "etkbwebcheck",
  storageBucket: "etkbwebcheck.firebasestorage.app",
  messagingSenderId: "682158847996",
  appId: "1:682158847996:web:c730427b967c659e09e479",
  measurementId: "G-Y951LLNK3Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
