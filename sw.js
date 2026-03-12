// PWA စနစ် အလုပ်လုပ်စေရန်အတွက် အခြေခံ Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install ပြီးပါပြီ');
});

self.addEventListener('fetch', (event) => {
    // လက်ရှိတွင် အင်တာနက်မရှိဘဲ သုံးနိုင်ရန် (Offline caching) မထည့်ထားပါ။
    // သို့သော် Install ခလုတ်ပေါ်လာစေရန် ဤ Fetch event လိုအပ်ပါသည်။
});
