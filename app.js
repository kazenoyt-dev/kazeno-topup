import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// Image Compression
const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500;
                let width = img.width, height = img.height;
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        };
    });
};

// Handle Topup Form
if(document.getElementById('topupForm')) {
    document.getElementById('topupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.innerText = "Order တင်နေသည်..."; btn.disabled = true;

        try {
            const receipt = await compressImage(document.getElementById('receipt').files[0]);
            await addDoc(collection(db, "orders"), {
                userId: document.getElementById('userId').value,
                zoneId: document.getElementById('zoneId').value,
                package: document.getElementById('package').value,
                receiptUrl: receipt,
                status: "Pending",
                timestamp: serverTimestamp()
            });
            alert("အောင်မြင်ပါသည်။");
            location.reload();
        } catch (e) { alert("Error: " + e.message); }
    });
}

// Check Status Function
window.checkStatus = async () => {
    const searchId = document.getElementById('searchId').value;
    const resultDiv = document.getElementById('statusResult');
    if(!searchId) return;

    resultDiv.innerHTML = "ရှာဖွေနေပါသည်...";
    const q = query(collection(db, "orders"), where("userId", "==", searchId), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);

    if(snap.empty) { resultDiv.innerHTML = "Order မတွေ့ပါ။"; return; }
    
    let html = "";
    snap.forEach(doc => {
        const data = doc.data();
        const color = data.status === "Pending" ? "orange" : "green";
        html += `<div style="border:1px solid #ddd; padding:10px; border-radius:8px; margin-bottom:10px;">
                    <strong>Package:</strong> ${data.package}<br>
                    <strong>Status:</strong> <span style="color:${color}">${data.status}</span>
                 </div>`;
    });
    resultDiv.innerHTML = html;
};
