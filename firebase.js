import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"

const firebaseConfig = {
  apiKey: "AIzaSyAyq8pF97oH6Okb_eEWVm5e4xfwcA09EQ4",
  authDomain: "test-bdcd0.firebaseapp.com",
  projectId: "test-bdcd0",
  storageBucket: "test-bdcd0.appspot.com",
  messagingSenderId: "990918494458",
  appId: "1:990918494458:web:d6ca7784875a9121662143"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;