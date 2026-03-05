import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// အစ်ကို့ရဲ့ Firebase သော့ (Key) အမှန်
const firebaseConfig = {
  apiKey: "AIzaSyBp_4qwNLfZfHqfRbNS69XnBsym6quBwIw",
  authDomain: "kazeno-game-topup.firebaseapp.com",
  projectId: "kazeno-game-topup",
  storageBucket: "kazeno-game-topup.firebasestorage.app",
  messagingSenderId: "1091487801666",
  appId: "1:1091487801666:web:de6cac985bd42e199ae8db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const topupForm = document.getElementById('topupForm');
const submitBtn = document.getElementById('submitBtn');

// ပုံကို ဆိုဒ်ချုံ့ပြီး Base64 စာသားအဖြစ်ပြောင်းပေးမယ့် Function (အခမဲ့သိမ်းလို့ရအောင်ပါ)
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // ပုံဆိုဒ်ကို 600px အထိပဲထားမယ်
                const MAX_WIDTH = 600;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Quality ကို 60% ထားပြီး စာသားပြောင်းမယ်
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
};

topupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const userId = document.getElementById('userId').value;
    const zoneId = document.getElementById('zoneId').value;
    const packageInfo = document.getElementById('package').value;
    const receiptFile = document.getElementById('receipt').files[0];

    submitBtn.innerText = "Order တင်နေပါသည်... စောင့်ပါ";
    submitBtn.disabled = true;

    try {
        // Storage မလိုတော့ပါ၊ ပုံကို စာသားပြောင်းပြီး Database ထဲ တိုက်ရိုက်သိမ်းမယ်
        const base64Image = await compressImage(receiptFile);

        await addDoc(collection(db, "orders"), {
            userId: userId,
            zoneId: zoneId,
            package: packageInfo,
            receiptUrl: base64Image, // ပုံစာသားကို ဒီမှာသိမ်းပါပြီ
            status: "Pending", 
            timestamp: serverTimestamp() 
        });

        alert("Order တင်တာ အောင်မြင်ပါတယ်။");
        topupForm.reset(); 
        
    } catch (error) {
        console.error("Error: ", error);
        alert("အမှားအယွင်းဖြစ်နေပါတယ်။ ပြန်စမ်းကြည့်ပါ။");
    } finally {
        submitBtn.innerText = "Order တင်မည်";
        submitBtn.disabled = false;
    }
});
