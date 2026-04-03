# Google Play Store Yayin Rehberi - Kasik Uygulamasi

> **Uygulama:** Kasik - Ek Gida Rehberi
> **Paket Adi:** com.kasik.ekgida
> **EAS Project ID:** 105a5ea5-566d-40e1-8e3b-a2044081ff97
> **Tarih:** Nisan 2026

---

## Icerik

1. [Google Play Developer Hesabi Olusturma](#1-google-play-developer-hesabi-olusturma)
2. [Google Play Service Account Olusturma (EAS Submit icin)](#2-google-play-service-account-olusturma)
3. [Upload Keystore Olusturma](#3-upload-keystore-olusturma)
4. [eas.json Yapilandirmasi](#4-easjson-yapilandirmasi)
5. [Codemagic YAML Android Eklentileri](#5-codemagic-yaml-android-eklentileri)
6. [Build, Submit ve Test Komutlari](#6-build-submit-ve-test-komutlari)
7. [Google Play App Signing Kaydi](#7-google-play-app-signing-kaydi)
8. [Ilk Gonderim Oncesi Kontrol Listesi](#8-ilk-gonderim-oncesi-kontrol-listesi)

---

## 1. Google Play Developer Hesabi Olusturma

### Adim 1: Google Play Console'a Giris

1. https://play.google.com/console adresine gidin.
2. Mevcut Google hesabinizla (kverd) giris yapin.
3. "Hesap olustur" butonuna tiklayin.

### Adim 2: Hesap Turu Secimi

- **Kisisel hesap** veya **Kurulusu hesabi** seciminizi yapin.
- Kisisel hesap icin kimlik dogrulamasi gerekecek.
- Kurulus hesabi icin D-U-N-S numarasi veya sirket belgeleri istenir.

> **Oneri:** Tek basina gelistirici olarak "Kisisel hesap" secin. Ileride kurumsal hesaba gecis mumkundur.

### Adim 3: Kayit Ucretini Odeyin

- Tek seferlik **25 USD** kayit ucreti vardir.
- Kredi karti veya banka karti ile odeme yapilir.

### Adim 4: Kimlik Dogrulamasi

1. Gercek ad-soyad bilgilerinizi girin.
2. Iletisim adresinizi girin (bu bilgi Play Store'da gorunebilir).
3. Telefon numaranizi dogrulayin.
4. Kimlik belgesi yukleyin (ehliyet, pasaport veya nufus cuzdani).
5. Dogrulama genellikle **2-7 is gunu** surer.

### Adim 5: Hesap Dogrulanmasi Sonrasi

- Dogrulama onaylaninca uygulama olusturma yetkisi acilir.
- Play Console'da "Uygulama olustur" butonuna tiklayin.
- Uygulama adi: **Kasik - Ek Gida Rehberi**
- Varsayilan dil: **Turkce (tr-TR)**
- Uygulama turu: **Uygulama** (oyun degil)
- Ucretsiz/Ucretli: **Ucretsiz** (uygulama ici satin alma ile gelir modeli)

---

## 2. Google Play Service Account Olusturma

EAS Submit komutuyla otomatik Play Store yuklemesi icin bir Service Account JSON anahtari gereklidir.

### Adim 1: Google Cloud Console'da Proje Olusturma/Secme

1. https://console.cloud.google.com adresine gidin.
2. Play Console ile ayni Google hesabiyla giris yapin.
3. Ust menuden proje seciciye tiklayin.
4. **"Yeni Proje"** olusturun veya mevcut projeyi secin.
   - Proje adi: `kasik-play-publish` (veya benzeri)

### Adim 2: Google Play Android Developer API'yi Etkinlestirin

1. Sol menuden **"API'ler ve Hizmetler" > "Kitaplık"** secin.
2. **"Google Play Android Developer API"** arayin.
3. **"Etkinlestir"** butonuna tiklayin.

### Adim 3: Service Account Olusturun

1. **"API'ler ve Hizmetler" > "Kimlik Bilgileri"** sayfasina gidin.
2. **"Kimlik Bilgisi Olustur" > "Hizmet Hesabi"** secin.
3. Bilgileri girin:
   - Hizmet hesabi adi: `kasik-play-publisher`
   - Hizmet hesabi kimlik: `kasik-play-publisher` (otomatik olusturulur)
   - Aciklama: `EAS Submit icin Play Store yayinlama hesabi`
4. **"Olustur ve Devam Et"** tiklayin.
5. Rol secimini **atlayin** (Play Console tarafinda yetki verilecek).
6. **"Bitti"** tiklayin.

### Adim 4: JSON Anahtari Indirin

1. Olusturulan hizmet hesabinin satirina tiklayin.
2. **"Anahtarlar"** sekmesine gecin.
3. **"Anahtar Ekle" > "Yeni anahtar olustur"** secin.
4. Format: **JSON** secin.
5. **"Olustur"** tiklayin. Dosya otomatik indirilir.
6. Indirilen dosyayi proje klasorune kopyalayin:

```bash
# Indirilen dosyayi proje klasorune tasiyın
cp ~/Downloads/kasik-play-publish-XXXXXXXX.json /Users/macair/Desktop/kasik-app/google/play-store-service-account.json
```

> **KRITIK:** Bu dosyayi **asla** git deposuna eklemeyin! .gitignore dosyasina ekleyin.

```bash
# .gitignore dosyasina ekleyin
echo "google/play-store-service-account.json" >> /Users/macair/Desktop/kasik-app/.gitignore
```

### Adim 5: Play Console'da Service Account Yetkisi Verin

1. https://play.google.com/console adresine gidin.
2. Sol menuden **"Ayarlar" > "API erisimi"** secin.
3. **"Mevcut Google Cloud projesini bagla"** bolumunde projenizi secin.
4. **"Hizmet hesaplari"** bolumunde olusturdugunuz hesabi goreceksiniz.
5. Hesabin yanindaki **"Erisimi yonet"** (veya "Izin ver") butonuna tiklayin.
6. **"Uygulama izinleri"** sekmesinde `com.kasik.ekgida` uygulamasini secin.
7. Asagidaki izinleri verin:
   - **Surumler** (Releases) - Yeni surumler yukleme ve yonetme
   - **Uretim surum yonetimi** (Production release management)
8. **"Degisiklikleri uygula"** tiklayin.
9. **"Hesap izinleri"** sekmesinden genel izinleri de kontrol edin.

> **Not:** Service Account izinlerinin aktif olmasi **24-48 saat** surebilir. Ilk denemeniz basarisiz olursa bekleyin.

---

## 3. Upload Keystore Olusturma

Android uygulamalarini imzalamak icin bir keystore dosyasi gereklidir.

### Yontem A: EAS Build ile Otomatik (Onerilen)

EAS Build ilk calistirdiginda otomatik olarak bir keystore olusturur ve Expo sunucularinda guvenli sekilde saklar. **Ek bir islem yapmaniza gerek yoktur.**

```bash
# Ilk production build'de EAS otomatik keystore olusturur
eas build --platform android --profile production
```

EAS size soracak:
```
Would you like to create a new Android Keystore? (Y/n)
```
**Y** yazin ve Enter'a basin. EAS keystore'u olusturup guvenle saklayacaktir.

### Yontem B: Manuel Keystore Olusturma (Ileri Duzey)

Kendi keystore'unuzu olusturmak isterseniz:

```bash
# Keystore olusturma
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass GUCLU_BIR_SIFRE_GIRIN \
  -keypass GUCLU_BIR_SIFRE_GIRIN \
  -alias kasik-upload-key \
  -keystore /Users/macair/Desktop/kasik-app/google/kasik-upload.keystore \
  -dname "CN=Kasik App,OU=Mobile,O=Kverd,L=Istanbul,ST=Istanbul,C=TR"
```

Manuel keystore'u EAS'e yuklemek icin:

```bash
# Keystore'u EAS credentials'a yukleyin
eas credentials --platform android
```

Adimlari takip edin:
1. "production" build profilini secin.
2. "Keystore" secenegini secin.
3. "Set up a new keystore" > "I want to upload my own keystore" secin.
4. Keystore dosya yolunu girin.
5. Alias, keystore sifresi ve key sifresini girin.

> **KRITIK:** Keystore sifrelerini guvenli bir yerde saklayin (1Password, Bitwarden vb.). Keystore kaybolursa uygulamayi **asla** guncelleyemezsiniz.

---

## 4. eas.json Yapilandirmasi

Asagidaki guncel `eas.json` dosyasini kullanin. Android submit bolumu eklenmistir:

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6760733830",
        "ascApiKeyPath": "./AuthKey_55WBKJ3625.p8",
        "ascApiKeyId": "55WBKJ3625",
        "ascApiKeyIssuerId": "c7db0adb-455d-4c4f-aa3b-ba9327302766"
      },
      "android": {
        "serviceAccountKeyPath": "./google/play-store-service-account.json",
        "track": "internal",
        "releaseStatus": "draft",
        "changesNotSentForReview": true
      }
    }
  }
}
```

### Yapilandirma Aciklamalari

| Alan | Aciklama |
|------|----------|
| `serviceAccountKeyPath` | Adim 2'de indirilen JSON anahtar dosyasinin yolu |
| `track` | Ilk gonderim icin `internal` (dahili test). Sonra `alpha`, `beta` veya `production` |
| `releaseStatus` | `draft` = taslak olarak gonder, `completed` = otomatik yayinla |
| `changesNotSentForReview` | `true` = degisiklikler incelemeye gonderilmez (taslakta kalir) |

### Track Secenekleri

- **`internal`** - Dahili test grubu (20 kisiye kadar, aninda erisim)
- **`alpha`** - Kapali test (secili kullanicilar, inceleme gerekli)
- **`beta`** - Acik test (herkes katilabilir, inceleme gerekli)
- **`production`** - Canli yayin (tum kullanicilar, inceleme gerekli)

> **Oneri:** Ilk gonderimi `internal` track ile `draft` olarak yapin. Play Console'dan kontrol ettikten sonra `production` a gecin.

---

## 5. Codemagic YAML Android Eklentileri

Mevcut `codemagic.yaml` dosyaniza asagidaki Android workflow'unu ekleyin:

```yaml
  # === Android Build & Play Store ===
  android-production:
    name: Android Production
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      groups:
        - app_credentials
        - android_credentials
      vars:
        PACKAGE_NAME: "com.kasik.ekgida"
      node: 20
      java: 17
    scripts:
      - name: Install npm dependencies
        script: |
          npm ci

      - name: Run Expo Prebuild
        script: |
          npx expo prebuild --platform android --clean

      - name: Decode and set up keystore
        script: |
          echo $CM_KEYSTORE | base64 --decode > $CM_BUILD_DIR/kasik-upload.keystore
          cat > $CM_BUILD_DIR/android/key.properties << EOF
          storeFile=$CM_BUILD_DIR/kasik-upload.keystore
          storePassword=$CM_KEYSTORE_PASSWORD
          keyAlias=$CM_KEY_ALIAS
          keyPassword=$CM_KEY_PASSWORD
          EOF

      - name: Set up local.properties
        script: |
          echo "sdk.dir=$ANDROID_SDK_ROOT" > $CM_BUILD_DIR/android/local.properties

      - name: Build AAB
        script: |
          cd android
          chmod +x gradlew
          ./gradlew bundleRelease

      - name: Collect AAB artifact
        script: |
          AAB_PATH=$(find android/app/build/outputs/bundle/release -name "*.aab" -print -quit)
          cp "$AAB_PATH" $CM_BUILD_DIR/app-release.aab

    artifacts:
      - app-release.aab
      - android/app/build/outputs/**/mapping.txt

    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true

    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true
```

### Codemagic Ortam Degiskenleri Ayarlama

Codemagic Dashboard'da **"Environment variables"** bolumune gidin ve `android_credentials` grubunda su degiskenleri tanimlayin:

| Degisken | Aciklama | Nasil Elde Edilir |
|----------|----------|-------------------|
| `CM_KEYSTORE` | Keystore dosyasinin base64 kodlanmis hali | `base64 -i kasik-upload.keystore` |
| `CM_KEYSTORE_PASSWORD` | Keystore sifresi | Keystore olustururken belirlediniz |
| `CM_KEY_ALIAS` | Anahtar alias'i | `kasik-upload-key` |
| `CM_KEY_PASSWORD` | Anahtar sifresi | Keystore olustururken belirlediniz |
| `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` | Service Account JSON iceriginin **tamami** | JSON dosyasinin tum icerigini yapisttirin |

#### Keystore'u Base64'e Cevirme

EAS tarafindan olusturulan keystore'u indirmek icin:

```bash
# EAS keystore'unu indirin
eas credentials --platform android
# "Download existing keystore" secin
# Indirilen dosyayi base64'e cevirin
base64 -i /indirilen/dosya/yolu.jks | pbcopy
# Panoya kopyalandi, Codemagic'e yapisttirin
```

---

## 6. Build, Submit ve Test Komutlari

### Yerel Gelistirme Testi

```bash
# Android emulatorunde test etmek icin development build
eas build --platform android --profile development

# APK olarak preview build (test cihazina yuklemek icin)
eas build --platform android --profile preview
```

### Production Build

```bash
# Sadece Android production build
eas build --platform android --profile production

# Hem iOS hem Android production build
eas build --platform all --profile production
```

### Play Store'a Gonderim

```bash
# Son build'i Play Store'a gonder (internal track, taslak)
eas submit --platform android --profile production

# Belirli bir build'i gonder (build ID ile)
eas submit --platform android --profile production --id BUILD_ID_BURAYA

# Build + Submit tek komutta (build bitince otomatik gonder)
eas build --platform android --profile production --auto-submit
```

### Track Degistirme (Komut Satirindan)

```bash
# Dahili test icin
eas submit --platform android --profile production

# Production (canli) icin - eas.json'da track'i degistirin veya:
# eas.json'da "track": "production", "releaseStatus": "completed" yapin
```

### Faydali EAS Komutlari

```bash
# Mevcut credentials'lari goruntuleme
eas credentials --platform android

# Build durumunu kontrol etme
eas build:list --platform android

# Build loglarini goruntuleme
eas build:view BUILD_ID

# Surum numarasini kontrol etme
eas build:version:get --platform android
```

### Yerel Test (Emulatorde)

```bash
# Preview APK'yi indirip emulatorde test etme
eas build --platform android --profile preview

# Build tamamlaninca cikan URL'den APK'yi indirin
# Emulatorde kurun:
adb install /indirilen/dosya.apk
```

---

## 7. Google Play App Signing Kaydi

Google Play App Signing, uygulamanizin imzalama anahtarini Google'in guvenli sunucularinda saklar. **EAS Build kullananlar icin bu otomatik olarak yapilir.**

### EAS Build Kullaniyorsaniz (Otomatik Yontem)

1. Ilk `eas build --platform android --profile production` komutunu calistirdiginizda EAS otomatik olarak bir **upload keystore** olusturur.
2. AAB dosyasini Play Console'a ilk kez yuklerken Google Play otomatik olarak **App Signing** kaydini yapar.
3. Google, sizin upload key'inizden farkli bir **app signing key** olusturur ve bunu kendi sunucularinda saklar.

### Manuel Kayit (Gerekirse)

1. Play Console'da uygulamaniza gidin.
2. Sol menuden **"Surum" > "Kurulum" > "Uygulama butunlugu"** secin.
3. **"Uygulama imzalama"** sekmesine tiklayin.
4. **"Google Play Uygulama Imzalama'ya kaydet"** butonuna tiklayin.
5. Sartlari kabul edin.

### Upload Key Sifirlanmasi Gerekirse

Upload key'inizi kaybettiyseniz:

1. Play Console'da **"Uygulama imzalama"** sayfasina gidin.
2. **"Upload anahtari sifirlama talep et"** secin.
3. Yeni bir upload key olusturun ve PEM dosyasini yukleyin.
4. Google ekibi talebi inceleyip onaylayacaktir (birkas gun surebilir).

### Onemli Bilgiler

- **App Signing Key**: Google'in sunucularinda saklanir. Siz bu anahtara dogrudan erisemezsiniz.
- **Upload Key**: Sizin build'lerinizi imzalamak icin kullandiginiz anahtar. Bu kaybolursa sifirlanabilir.
- AAB formati kullaniyorsaniz (EAS production build varsayilan olarak AAB uretir), App Signing **zorunludur**.
- APK yerine AAB kullanmak **Google Play'in sart kosmasi** nedeniyle zorunludur (Agustos 2021'den beri).

---

## 8. Ilk Gonderim Oncesi Kontrol Listesi

### A. Hesap ve Erisim

- [ ] Google Play Developer hesabi olusturuldu ve dogrulandi (25 USD odendi)
- [ ] Google Cloud Console'da proje olusturuldu
- [ ] Google Play Android Developer API etkinlestirildi
- [ ] Service Account olusturuldu ve JSON anahtari indirildi
- [ ] Service Account'a Play Console'da izinler verildi
- [ ] Service Account izinlerinin aktif olmasi icin 24-48 saat beklendi

### B. Uygulama Yapilandirmasi

- [ ] `app.json` icinde `android.package` dogru: `com.kasik.ekgida`
- [ ] `app.json` icinde `android.versionCode` dogru ayarlandi
- [ ] `app.json` icinde `android.adaptiveIcon` dosyalari mevcut
- [ ] `google-services.json` dosyasi proje kokunde mevcut
- [ ] `eas.json` icinde Android submit bolumu eklendi
- [ ] Service Account JSON dosyasi `.gitignore`'a eklendi

### C. Play Console Uygulama Ayarlari

- [ ] Play Console'da uygulama olusturuldu (`com.kasik.ekgida`)
- [ ] Uygulama adi girildi: "Kasik - Ek Gida Rehberi"
- [ ] Varsayilan dil Turkce secildi
- [ ] **Uygulama icerik derecelendirmesi** anketi tamamlandi
  - Play Console > Uygulama icerigi > Icerik derecelendirmesi
  - IARC anketini doldurun
- [ ] **Gizlilik politikasi URL'si** eklendi
  - URL: `https://kverd123.github.io/kasik-app/privacy.html`
- [ ] **Veri guvenligi formu** dolduruldu
  - Toplanan veriler: ad, e-posta, bebek bilgileri, kullanim verileri
  - Paylasilan veriler: reklam (AdMob), analitik (Firebase)
  - Sifreleme: evet (Firebase HTTPS)
  - Silme talebi: kullanici hesap silme ozelligi
- [ ] **Reklam icerigi beyani** yapildi (AdMob kullanildigini belirtin)
- [ ] **Hedef kitle ve icerik** bolumu dolduruldu
  - DIKKAT: Cocuklara yonelik uygulama ise COPPA/Aile politikalarina uyum zorunlu
  - Hedef yas grubu: 18+ (ebeveynlere yonelik)
- [ ] **Ulke ve bolge dagitimi** secildi
  - En azindan Turkiye secin
- [ ] **Uygulama kategorisi** secildi: Saglik ve Fitness veya Ebeveynlik
- [ ] **Iletisim bilgileri** girildi (e-posta, web sitesi)

### D. Store Listesi (Magaza Sayfasi)

- [ ] Kisa aciklama (80 karakter): "Bebeginizin ek gida yolculugunda yaninizda!"
- [ ] Tam aciklama (4000 karakter): Uygulamanin tum ozelliklerini aciklayin
- [ ] **Ekran goruntuleri** yuklendi:
  - Telefon: En az 2 adet (onerilen 4-8 adet), 16:9 veya 9:16 oran
  - Minimum boyut: 320px, Maksimum boyut: 3840px
  - 7 inc tablet: Opsiyonel ama onerilen
  - 10 inc tablet: Opsiyonel ama onerilen
- [ ] **Uygulama simgesi**: 512x512 px, 32-bit PNG (alpha kanali olmadan)
  - Bu Play Console'a ayrica yuklenir, `adaptiveIcon` farklidir
- [ ] **Ozellik grafigi** (Feature Graphic): 1024x500 px, JPG veya PNG
  - Play Store'da ust bannerde goruntulenir

### E. Teknik Kontroller

- [ ] `eas build --platform android --profile production` basariyla tamamlandi
- [ ] AAB dosyasi uretildi (APK degil)
- [ ] Google Play App Signing aktif
- [ ] Firebase Android uygulamasi ekli (`google-services.json` paket adi uyumlu)
- [ ] AdMob Android uygulama ID'si dogru (`ca-app-pub-8099877386187148~1136119394`)
- [ ] RevenueCat Android uygulamasi olusturuldu ve API anahtari eklendi
- [ ] Google Sign-In icin SHA-1 parmak izi Firebase'e eklendi
- [ ] Push Notifications icin FCM yapilandirmasi tamam

### F. SHA-1 Parmak Izi (Firebase ve Google Sign-In icin)

Google Sign-In'in Android'de calismasi icin SHA-1 parmak izini Firebase'e eklemeniz gerekir:

```bash
# EAS tarafindan yonetilen keystore icin SHA-1'i goruntuleme
eas credentials --platform android
# "Keystore" > "View credentials" secin
# SHA-1 Fingerprint degerini not edin
```

Sonra:
1. Firebase Console > Proje Ayarlari > Genel sekmesi
2. Android uygulamanizi secin (com.kasik.ekgida)
3. "Parmak izi ekle" tiklayin
4. SHA-1 degerini yapisttirin
5. `google-services.json` dosyasini yeniden indirip projeye kopyalayin

**Google Play App Signing SHA-1'i de ekleyin:**
1. Play Console > Uygulama imzalama sayfasi
2. "Uygulama imzalama sertifikasi" altindaki SHA-1 degerini kopyalayin
3. Firebase'e bu SHA-1'i de ekleyin

### G. Ilk Gonderim Adim Adim

1. Build'i olusturun:
   ```bash
   eas build --platform android --profile production
   ```

2. Build tamamlaninca Play Store'a gonderin:
   ```bash
   eas submit --platform android --profile production
   ```

3. Play Console'da kontrol edin:
   - Sol menuden **"Surum" > "Dahili test"** secin
   - Taslak surumu goreceksiniz
   - Inceleyip **"Incelemeye gonder"** tiklayin

4. Ilk inceleme genellikle **3-7 gun** surer. Sonraki guncellemeler daha hizlidir.

### H. Codemagic Entegrasyonu (CI/CD)

- [ ] `codemagic.yaml` dosyasina Android workflow eklendi
- [ ] Codemagic Dashboard'da `android_credentials` degisken grubu olusturuldu
- [ ] `CM_KEYSTORE` (base64), `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, `CM_KEY_PASSWORD` tanimlandi
- [ ] `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` tanimlandi
- [ ] Test build'i Codemagic uzerinden basariyla tamamlandi

---

## Hizli Baslangic Ozeti

En kisa yoldan Play Store'a cikmak icin siralamayla yapmaniz gerekenler:

```
1. Google Play Developer hesabi ac ve dogrula (25 USD)
2. Play Console'da uygulama olustur (com.kasik.ekgida)
3. Google Cloud'da Service Account + JSON anahtari olustur
4. Service Account'a Play Console'da yetki ver
5. eas.json'a Android submit yapilandirmasini ekle
6. eas build --platform android --profile production
7. eas submit --platform android --profile production
8. Play Console'da magaza bilgilerini doldur
9. Incelemeye gonder
```

> **Tahmini sure:** Hesap dogrulamasi haric, teknik kurulum yaklasik **2-3 saat** surer. Hesap dogrulamasi 2-7 is gunu arasinda degisir.
