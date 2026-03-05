import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ပုံ (၁၂၉၈) ထဲက အမှန်ကန်ဆုံး Config
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
const db = getFirestore(app);

const authBtn = document.getElementById('auth-btn');
const toggleText = document.getElementById('toggle-form');
const title = document.getElementById('form-title');
let isLogin = true;

toggleText.onclick = () => {
    isLogin = !isLogin;
    title.innerText = isLogin ? "Login" : "Register";
    authBtn.innerText = isLogin ? "Login" : "Create Account";
    toggleText.innerText = isLogin ? "အကောင့်မရှိသေးဘူးလား? Register လုပ်ရန်" : "အကောင့်ရှိပြီးသားလား? Login ဝင်ရန်";
};

authBtn.onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password) { alert("Email နဲ့ Password ဖြည့်ပါ"); return; }

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login အောင်မြင်ပါတယ်။");
        } else {
            // အကောင့်အသစ်ဖွင့်ခြင်း
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // အကောင့်ဖွင့်ပြီးတာနဲ့ Database ထဲမှာ User ရဲ့ Wallet ကို တစ်ခါတည်း ဆောက်ပေးမယ်
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                balance: 0, // စစချင်းမှာ 0 Ks
                role: "user",
                createdAt: serverTimestamp()
            });
            alert("အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါတယ်။ Wallet ကိုလည်း ဆောက်ပေးလိုက်ပါပြီ။");
        }
        window.location.href = "index.html"; 
    } catch (error) {
        alert("Error: " + error.message);
    }
};
