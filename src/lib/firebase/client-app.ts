
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "studio-6273848800-87a15",
  "appId": "1:8721374594:web:d6158432c898262022c39b",
  "apiKey": "AIzaSyDpY0sES18Lm6kdCULT1pLzQWNlm334Zww",
  "authDomain": "studio-6273848800-87a15.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "8721374594"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
