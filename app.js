// Firebase ကို Import လုပ်ခြင်း (addDoc ကို ထပ်ထည့်ထားပါသည်)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ⚠️ အောက်ပါ နေရာတွင် ကိုယ့်လူ၏ Firebase Config ကို ပြန်ထည့်ပါ
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

// SPA စာမျက်နှာပြောင်းရန် Function
window.showPage = function(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// (၁) Firebase မှ Product များကို ဆွဲယူပြသခြင်း Function
async function loadProducts() {
    const shopContainer = document.querySelector('.shop-grid');
    shopContainer.innerHTML = '<p style="text-align:center; width:100%;">Loading Packages...</p>';

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        shopContainer.innerHTML = ''; 

        if(querySnapshot.empty) {
            shopContainer.innerHTML = '<p>ပစ္စည်းများ မရှိသေးပါ ခင်ဗျာ။ Admin Page မှ သွားရောက်ထည့်သွင်းပါ။</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productHTML = `
                <div class="glass-card product">
                    <h3>${product.icon} ${product.name}</h3>
                    <p>${product.game}</p>
                    <p class="price">${product.price}</p>
                    <button class="btn-buy" onclick="buyProduct('${doc.id}', '${product.name}')">Buy Now</button>
                </div>
            `;
            shopContainer.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error loading products: ", error);
        shopContainer.innerHTML = '<p>အချက်အလက်များ ရယူရာတွင် အမှားအယွင်းရှိနေပါသည်။</p>';
    }
}

// Web App စတက်တာနဲ့ ပစ္စည်းတွေကို လှမ်းယူရန်
loadProducts();

// (၂) Admin Page မှတစ်ဆင့် ပစ္စည်းအသစ် ထည့်သွင်းခြင်း (New Feature)
document.getElementById('addProductBtn').addEventListener('click', async () => {
    const icon = document.getElementById('p-icon').value;
    const name = document.getElementById('p-name').value;
    const game = document.getElementById('p-game').value;
    const price = document.getElementById('p-price').value;

    // အချက်အလက်များ ပြည့်စုံမှု ရှိ/မရှိ စစ်ဆေးခြင်း
    if(!name || !price || !game) {
        alert("အချက်အလက်များကို ပြည့်စုံအောင် ထည့်ပေးပါ ကိုယ့်လူ!");
        return;
    }

    try {
        // Firebase ထဲသို့ ဒေတာ လှမ်းထည့်ခြင်း
        await addDoc(collection(db, "products"), {
            icon: icon,
            name: name,
            game: game,
            price: price
        });
        
        alert("ပစ္စည်းအသစ် ထည့်သွင်းခြင်း အောင်မြင်ပါသည် ခင်ဗျာ!");
        
        // Form ထဲက စာတွေကို ပြန်ဖျက်ပေးခြင်း
        document.getElementById('p-icon').value = '';
        document.getElementById('p-name').value = '';
        document.getElementById('p-game').value = '';
        document.getElementById('p-price').value = '';
        
        // Shop စာမျက်နှာကို ပြန်ခေါ်ပြီး Update လုပ်ခြင်း
        loadProducts();
        showPage('shop');

    } catch(error) {
        alert("Error: " + error.message);
    }
});

// (၃) Buy Now Button နှိပ်လျှင် အလုပ်လုပ်မည့် Function
window.buyProduct = function(productId, productName) {
    alert(productName + " ကို ဝယ်ယူရန် ရွေးချယ်လိုက်ပါတယ်။");
}

// (၄) Login Button နှိပ်လျှင်
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login အောင်မြင်ပါသည် ကိုယ့်လူ!");
            showPage('shop');
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});
