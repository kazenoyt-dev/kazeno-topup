import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBp_4qwNLfZfHqfRbNS69XnBsym6quBwIw",
  authDomain: "kazeno-game-topup.firebaseapp.com",
  projectId: "kazeno-game-topup",
  storageBucket: "kazeno-game-topup.firebasestorage.app",
  messagingSenderId: "1091487801666",
  appId: "1:1091487801666:web:de6cac985bd42e199ae8db"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authBtn = document.getElementById('auth-btn');
const toggleText = document.getElementById('toggle-form');
const title = document.getElementById('form-title');
let isLogin = true;

// Login နဲ့ Register ပုံစံ ပြောင်းလဲခြင်း
toggleText.onclick = () => {
    isLogin = !isLogin;
    title.innerText = isLogin ? "Login" : "Register";
    authBtn.innerText = isLogin ? "Login" : "Create Account";
    toggleText.innerText = isLogin ? "အကောင့်မရှိသေးဘူးလား? Register လုပ်ရန်" : "အကောင့်ရှိပြီးသားလား? Login ဝင်ရန်";
};

authBtn.onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login အောင်မြင်ပါတယ်။");
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါတယ်။");
        }
        window.location.href = "index.html"; // Dashboard ဆီ လွှတ်လိုက်မယ်
    } catch (error) {
        alert("Error: " + error.message);
    }
};

