# Google Play Store - Kasik Ek Gida Rehberi

**Paket Adi:** com.kasik.ekgida
**Uygulama:** Kasik - Ek Gida Rehberi
**Tarih:** 2 Nisan 2026

---

## Dosya Yapisi

| Dosya | Aciklama | Durum |
|-------|----------|-------|
| `store-listing-tr.md` | Store listing (baslik, aciklama, anahtar kelimeler) | Hazir |
| `data-safety-form.md` | Veri guvenligi formu (Data Safety) cevaplari | Hazir |
| `content-rating-guide.md` | Icerik derecelendirme anketi cevaplari | Hazir |
| `android-build-setup.md` | EAS build, submit, Codemagic ve keystore rehberi | Hazir |
| `graphic-assets-guide.md` | Ekran goruntusu ve grafik materyal gereksinimleri | Hazir |

---

## Yayinlama Adimlari (Ozet)

### Adim 1: Google Play Developer Hesabi
- [ ] Google Play Console'da gelistirici hesabi olustur (25 USD)
- [ ] Kimlik dogrulamasi tamamla

### Adim 2: Service Account & Anahtar
- [ ] Google Cloud Console'da Service Account olustur
- [ ] JSON anahtarini indir ve `google/` klasorune kaydet
- [ ] `.gitignore` dosyasina `google/*.json` ekle (gizli anahtarlar icin)
- [ ] Play Console'da Service Account'a yetki ver

### Adim 3: Uygulama Olusturma (Play Console)
- [ ] Play Console'da yeni uygulama olustur
- [ ] Varsayilan dil: Turkce (tr-TR)
- [ ] Uygulama adi: "Kasik - Ek Gida Rehberi"

### Adim 4: Store Listing Doldurma
- [ ] `store-listing-tr.md` dosyasindaki baslik, kisa aciklama, uzun aciklamayi kopyala
- [ ] Kategori: Saglik ve Fitness
- [ ] Iletisim: help@marselproject.com
- [ ] Gizlilik Politikasi URL'si ekle

### Adim 5: Grafik Materyaller
- [ ] Feature Graphic (1024x500 px) tasarla ve yukle
- [ ] Telefon ekran goruntuleri (min 2, max 8) olustur ve yukle
- [ ] 512x512 px yuksek cozunurluklu ikon yukle
- [ ] (Opsiyonel) Tanitim videosu yukle
- [ ] Detaylar icin `graphic-assets-guide.md` dosyasina bak

### Adim 6: Icerik Derecelendirme
- [ ] `content-rating-guide.md` dosyasindaki cevaplari IARC anketine gir
- [ ] Beklenen sonuc: PEGI 3 / ESRB Everyone

### Adim 7: Veri Guvenligi (Data Safety)
- [ ] `data-safety-form.md` dosyasindaki cevaplari Data Safety formuna gir
- [ ] Onemli: AdMob tek "paylasilan" veri turudur
- [ ] Hesap silme akisini kontrol et (Firestore alt koleksiyonlari!)

### Adim 8: Fiyatlandirma & Dagitim
- [ ] Ucretsiz uygulama olarak ayarla
- [ ] Ulke secimi: Turkiye (ve diger hedef ulkeler)
- [ ] Uygulama icerigi beyanlarini doldur (reklam var, uygulama ici satin alim var)
- [ ] Hedef kitle: 18+ (ebeveynler, cocuklara yonelik degil)

### Adim 9: Android Build & Submit
- [ ] `eas build --platform android --profile production` komutuyla AAB olustur
- [ ] `eas submit --platform android` komutuyla Play Console'a gonder
- [ ] Veya Codemagic ile otomatik build/submit yapilandir
- [ ] Detaylar icin `android-build-setup.md` dosyasina bak

### Adim 10: Firebase & Google Sign-In
- [ ] Firebase Console'da Android uygulamasinin SHA-1 parmak izini ekle
- [ ] Google Sign-In icin OAuth istemci kimligini yapilandir
- [ ] `google-services.json` dosyasinin guncel oldugunu dogrula

### Adim 11: Test & Inceleme
- [ ] Dahili test hattinda (Internal Testing) test yap
- [ ] Kapali test (Closed Testing) ile beta kullanicilara dagit
- [ ] Incelemeye gonder (ilk inceleme 3-7 gun surebilir)

---

## Onemli Uyarilar

1. **Hesap Silme:** `deleteAccount()` fonksiyonu Firestore alt koleksiyonlarini (babies, mealPlans) silmiyor. Google Play icin Cloud Function ile tam veri silme gerekli.

2. **Service Account JSON:** `play-store-service-account.json` dosyasini ASLA git'e commit etme!

3. **AdMob Android App ID:** `app.json` icinde iOS ve Android icin ayni AdMob app ID kullaniliyor. Android icin ayri bir AdMob uygulamasi olusturmak gerekebilir.

4. **Google Play App Signing:** Ilk AAB yuklediginde otomatik olarak etkinlestirilir. Upload key'i guvenli bir yerde sakla.

5. **Ilk Inceleme:** Google Play ilk inceleme sureci 3-7 gun surebilir. Reddedilirse `content-rating-guide.md` ve `data-safety-form.md` dosyalarini kontrol et.
