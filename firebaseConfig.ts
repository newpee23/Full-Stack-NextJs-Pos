
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBH6zG8yl3yEK4G_vxd2Uhzv3aSQKiHjjI",
  authDomain: "project-nextpos-828f7.firebaseapp.com",
  projectId: "project-nextpos-828f7",
  storageBucket: "project-nextpos-828f7.appspot.com",
  messagingSenderId: "779852305621",
  appId: "1:779852305621:web:c870b8b25e9457aca7be5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage();