import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// အစ်ကို့ရဲ့ Firebase သော့ (Key)
const firebaseConfig = {
  apiKey: "AIzaSyBp_4qwWLfZFHqfRbNS69XnBsym6quBwIw",
  authDomain: "kazeno-game-topup.firebaseapp.com",
  projectId: "kazeno-game-topup",
  storageBucket: "kazeno-game-topup.firebasestorage.app",
  messagingSenderId: "1091487801666",
  appId: "1:1091487801666:web:de6cac985bd42e199ae8db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const topupForm = document.getElementById('topupForm');
const submitBtn = document.getElementById('submitBtn');

topupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const userId = document.getElementById('userId').value;
    const zoneId = document.getElementById('zoneId').value;
    const packageInfo = document.getElementById('package').value;
    const receiptFile = document.getElementById('receipt').files[0];

    submitBtn.innerText = "Order တင်နေပါသည်... စောင့်ပါ";
    submitBtn.disabled = true;

    try {
        const storageRef = ref(storage, 'receipts/' + Date.now() + '_' + receiptFile.name);
        await uploadBytes(storageRef, receiptFile);
        
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "orders"), {
            userId: userId,
            zoneId: zoneId,
            package: packageInfo,
            receiptUrl: downloadURL,
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
