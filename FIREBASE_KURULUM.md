# Firebase Kurulum Rehberi — Kasik App

## 1. Firebase Projesi Olustur

1. https://console.firebase.google.com adresine git
2. **"Proje Ekle"** butonuna tikla
3. Proje adi: `kasik-app`
4. Google Analytics: **Etkinlestir** (Turkiye secenegi)
5. **"Proje Olustur"** tikla

## 2. Web Uygulamasi Ekle

1. Proje anasayfasinda **"</>"** (Web) ikonuna tikla
2. Uygulama adi: `kasik-web`
3. Firebase Hosting: **Hayir** (simdilik gerek yok)
4. **"Uygulamayi kaydet"** tikla
5. Gosterilen config degerlerini kopyala:

```
apiKey: "AIzaSy..."
authDomain: "kasik-app-xxxxx.firebaseapp.com"
projectId: "kasik-app-xxxxx"
storageBucket: "kasik-app-xxxxx.firebasestorage.app"
messagingSenderId: "123456789"
appId: "1:123456789:web:abcdef"
measurementId: "G-XXXXXXX"
```

6. Bu degerleri `.env` dosyasina yapistir (asagida)

## 3. Authentication Ayarla

1. Sol menude **"Authentication"** tikla
2. **"Baslayin"** tikla
3. Saglayicilar sekmesinde su yontemleri etkinlestir:

### E-posta/Sifre
- "E-posta/Sifre" satirina tikla
- **"Etkinlestir"** toggle'ini ac
- Kaydet

### Google ile Giris
- "Google" satirina tikla
- **"Etkinlestir"** toggle'ini ac
- Proje destek e-postasi: kendi e-postan
- Kaydet

### Apple ile Giris (iOS icin)
- "Apple" satirina tikla
- **"Etkinlestir"** toggle'ini ac
- Kaydet
- (Apple Developer hesabi gerekli — App Store yayini icin)

## 4. Cloud Firestore Olustur

1. Sol menude **"Firestore Database"** tikla
2. **"Veritabani olustur"** tikla
3. Konum: **europe-west1 (Belcika)** — Turkiye'ye en yakin
4. Guvenlik kurallari: **"Test modunda basla"** sec (sonra guncelleyecegiz)
5. **"Olustur"** tikla

### Firestore Indeksler (Otomatik olusur ama onceden ekle)

Firebase Console > Firestore > Indeksler sekmesinde:

| Koleksiyon | Alanlar | Siralama |
|-----------|---------|----------|
| recipes | likes (Desc), createdAt (Desc) | Bilesik |
| recipes | ageGroup (Asc), createdAt (Desc) | Bilesik |
| posts | likes (Desc), createdAt (Desc) | Bilesik |
| mealPlans | babyId (Asc), date (Desc) | Bilesik |

## 5. Firebase Storage Ayarla

1. Sol menude **"Storage"** tikla
2. **"Baslayin"** tikla
3. Guvenlik kurallari: **"Test modunda basla"**
4. Konum: **europe-west1** (Firestore ile ayni)
5. **"Bitti"** tikla

## 6. Android Ayarlari (Opsiyonel — Push icin)

1. Proje ayarlari > **"Uygulama ekle"** > Android
2. Paket adi: `com.kasik.ekgida`
3. **"Uygulamayi kaydet"**
4. `google-services.json` dosyasini indir
5. Dosyayi `/Users/macair/Desktop/kasik-app/` klasorune kopyala

## 7. iOS Ayarlari (Opsiyonel — Push icin)

1. Proje ayarlari > **"Uygulama ekle"** > iOS
2. Bundle ID: `com.kasik.ekgida`
3. **"Uygulamayi kaydet"**
4. `GoogleService-Info.plist` dosyasini indir
5. Dosyayi `/Users/macair/Desktop/kasik-app/` klasorune kopyala

## 8. .env Dosyasini Doldur

Firebase Console > Proje Ayarlari > Genel > Web uygulamasi config'inden:

```bash
# .env dosyasini ac ve degerleri yapistir:
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...gercek_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=kasik-app-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=kasik-app-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kasik-app-xxxxx.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

## 9. Test Et

```bash
cd /Users/macair/Desktop/kasik-app
npx expo start
```

- Kayit ol ekranindan yeni hesap olustur
- Firebase Console > Authentication'da kullanicinin gorundugunü kontrol et
- Firebase Console > Firestore'da `users` koleksiyonunda doc olustugunü kontrol et

## 10. Guvenlik Kurallarini Guncelle

Test bittikten sonra `firestore.rules` ve `storage.rules` dosyalarini
Firebase Console'a yapistir. (Bu dosyalar proje klasorunde hazir)

---

## Sorun Giderme

### "auth/configuration-not-found"
→ .env dosyasindaki degerler yanlis. Firebase Console'dan tekrar kopyala.

### "auth/network-request-failed"
→ Internet baglantisini kontrol et. VPN kapatmayi dene.

### "Firestore permission denied"
→ Guvenlik kurallarini test moduna al veya firestore.rules dosyasini uygula.

### Google Sign-In calismiyorsa
→ Firebase Console > Authentication > Google > Web SDK yapilandirmasi
→ SHA-1 parmak izi eklenmeli (Android icin)
