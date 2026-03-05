// Firebase ကို Import လုပ်ခြင်း
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ကိုယ်လူတို့ရဲ့ Firebase Project က ရလာမယ့် Config ကို ဒီနေရာမှာ အစားထိုးထည့်ပါ ခင်ဗျာ
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase ကို စတင်အသက်သွင်းခြင်း
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Single Page Application (SPA) စာမျက်နှာပြောင်းရန် Function
window.showPage = function(pageId) {
    // စာမျက်နှာအားလုံးကို ဖျောက်ပါမယ်
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // ရွေးချယ်လိုက်တဲ့ စာမျက်နှာကိုပဲ ပြန်ပြပါမယ်
    document.getElementById(pageId).classList.add('active');
}

// Login Button နှိပ်လျှင် အလုပ်လုပ်မည့် Function
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login အောင်မြင်ပါသည် ကိုယ့်လူ!");
            showPage('shop'); // Login ဝင်ပြီးရင် Shop ကို တန်းသွားပါမယ်
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});
