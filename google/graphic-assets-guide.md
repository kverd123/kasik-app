# Kasik - Google Play Store Grafik Varliklar Kilavuzu

**Uygulama:** Kasik - Ek Gida Rehberi
**Paket Adi:** com.kasik.ekgida
**Tasarim Tarihi:** Nisan 2026
**Durum:** Yayin oncesi kreatif brief

---

## Marka Renk Sistemi

Tum grafik varliklarda asagidaki renk paleti kullanilacaktir.

| Token              | Hex Kodu  | Kullanim Alani                          |
| ------------------ | --------- | --------------------------------------- |
| Birincil (Sage)    | `#6B9B5E` | Basliklar, CTA butonlari, vurgu alanlari |
| Sage Koyu          | `#4A7A42` | Gradient bitis, baslik arka plani        |
| Sage Acik          | `#B8D4A8` | Arka plan dolgu, ikon zeminleri          |
| Sage Soluk         | `#EEF6E8` | Kart arka planlari, genel zemin          |
| Krem               | `#FAF8F5` | Ana arka plan                            |
| Krem Koyu          | `#F0ECE6` | Ikincil arka plan                        |
| Seftali            | `#F5C0A0` | Aksan, badge, dekoratif ogeler           |
| Acik Mavi          | `#E8F0FA` | Bilgi kartlari                           |
| Yazi Koyu          | `#2E2E1E` | Ana metin                                |
| Yazi Orta          | `#5A5A4A` | Ikincil metin                            |
| Adaptive Icon BG   | `#A3BA91` | Android ikon arka plan (app.json'da)     |
| Beyaz              | `#FFFFFF` | Overlay metin, kart arka plan            |

**Tipografi Yonergesi:** Ekran goruntuleri uygulama icindeki fontu yansitsin. Overlay metinlerde **Nunito Bold** veya **Inter SemiBold** kullanilmalidir. Turkce karakterler (s, c, g, i, o, u, I) dogru gosterilmelidir.

---

## 1. Feature Graphic (Ozellik Gorseli) -- ZORUNLU

### Teknik Ozellikler

| Ozellik       | Deger                                  |
| ------------- | -------------------------------------- |
| Boyut         | 1024 x 500 px                          |
| Format        | JPEG veya 24-bit PNG (alfa yok)        |
| Alfa kanali   | YOK -- Google Play seffaflik kabul etmez |
| Guvenli alan  | Merkezde 900 x 400 px (kirilma payi)   |

### Kompozisyon Plani

```
+----------------------------------------------------------------------+
|                                                                      |
|   [Sol 1/3]              [Orta 1/3]            [Sag 1/3]            |
|                                                                      |
|   Uygulama ikonu         Ana baslik metin       Telefon mockup       |
|   (128x128 px,           blogu (beyaz veya      icinde uygulama      |
|   beyaz cerceve           krem renk yazi)       ekrani (tarifler     |
|   ile)                                          veya plan ekrani)    |
|                          "Kasik"                                     |
|                          "Bebeginizin Ek Gida                        |
|                           Yolculugunda           Hafifce egik         |
|                           Yaninizda"             (5-8 derece)         |
|                                                                      |
|   Dekoratif ogeler:                                                  |
|   Kucuk yiyecek           Alt satir:                                 |
|   ikonlari (havuc,       "200+ Tarif |                               |
|   brokoli, muz)           Yemek Plani |                              |
|                           Alerjen Takibi"                            |
|                                                                      |
+----------------------------------------------------------------------+
```

### Arka Plan

- **Gradient:** `#6B9B5E` (sol) --> `#4A7A42` (sag), veya `#EEF6E8` --> `#B8D4A8` (daha yumusak versiyon)
- **Alternatif:** Duuz `#A3BA91` zemin uzerinde beyaz/krem dalgali soyut sekiller
- Yogun doku veya fotograf kullanmayin; temiz ve okunakliligi on planda tutun

### Metin Onerileri

| Alan              | Turkce Metin                                        | Font Boyutu   |
| ----------------- | --------------------------------------------------- | ------------- |
| Ana baslik        | **Kasik**                                           | 72-80 pt Bold |
| Alt baslik        | Bebeginizin Ek Gida Yolculugunda Yaninizda          | 28-32 pt      |
| Ozellik satiri    | 200+ Tarif  /  Yemek Plani  /  Alerjen Takibi       | 18-20 pt      |

**Onemli:** Feature graphic, Play Store uygulama sayfasinin en ustunde gorunur. Kullanici promo videosu yuklemediyse bu gorsel tek basina goruntulenir. Telefon kucuk ekranlarda goruntulediginden metin buyuk ve okunaklI olmalidir. Metni ortaya yakin konumlandirin.

### Yapilmamasi Gerekenler

- Alfa kanali / seffaflik kullanmayin
- Gorsel kenarlarina onemli metin veya oge yerlestirmeyin (Play Store kirpabilir)
- Cok fazla metin eklemeyin; 3 satiri gecmeyin
- Promosyon fiyat veya "ucretsiz" gibi ifadeler eklemeyin (Google politikasi)

---

## 2. Ekran Goruntuleri (Screenshots) -- ZORUNLU

### Teknik Ozellikler

| Cihaz Tipi       | En Boy Orani | Min Boyut     | Max Boyut     | Min Adet | Max Adet | Oncelik    |
| ---------------- | ------------ | ------------- | ------------- | -------- | -------- | ---------- |
| Telefon          | 9:16 (dikey) | 320 px (kisa) | 3840 px (kisa)| 2        | 8        | ZORUNLU    |
| 7 inc Tablet     | 9:16 (dikey) | 320 px        | 3840 px       | --       | 8        | ONERILEN   |
| 10 inc Tablet    | 16:9 (yatay) | 320 px        | 3840 px       | --       | 8        | ONERILEN   |

### Onerilen Cozunurlukler

| Cihaz            | Onerilen Boyut       | Notlar                          |
| ---------------- | -------------------- | ------------------------------- |
| Telefon          | 1290 x 2796 px       | iPhone 15 Pro Max / Pixel 8 Pro |
| Telefon (alt.)   | 1080 x 1920 px       | Standart 1080p                  |
| 7 inc Tablet     | 1600 x 2560 px       | Dikey                           |
| 10 inc Tablet    | 2560 x 1600 px       | Yatay                           |

### Ekran Goruntusu Tasarim Sablon

Her ekran goruntusu asagidaki 3 katmanli yapida tasarlanacaktir:

```
+-----------------------------+
|                             |
|  [Overlay Metin Alani]      |  <-- Ust %20-25: Renkli bant veya gradient
|  Baslik + alt baslik        |      Arka plan: #6B9B5E veya #EEF6E8
|                             |
|-----------------------------|
|                             |
|  [Telefon Cercevesi]        |  <-- Orta %65: Cihaz mockup icinde
|  Gercek uygulama ekrani    |      gercek ekran goruntusu
|                             |
|                             |
|                             |
|-----------------------------|
|  [Alt dekoratif bant]       |  <-- Alt %10-15: opsiyonel ikon veya
|                             |      nokta sayfa gostergesi
+-----------------------------+
```

**Cihaz Cercevesi:** Siyah veya beyaz bir telefon mockup kullanin (Google Pixel veya genel cerceve). Golgeli olabilir. Cerceve icinde gercek uygulama ekrani gosterilecektir.

### Ekran Goruntusu Sirasi ve Icerikleri

Asagidaki sira, Play Store'da kullanicinin ilk gordugu siradir. En etkileyici ekranlar basa konulmalidir.

---

#### Screenshot 1 -- Hero / Karsilama

**Gosterilecek Ekran:** Ana sayfa / Tarifler ekrani (recipes.tsx)
**Overlay Metin:**

> **Bebeginiz Icin 200+ Tarif**
> Aya gore filtrelenebilir, kolay tarifler

**Kompozisyon Notlari:**
- Ust bantta uygulama logosu (kucuk, sol ust) ve baslik metni
- Telefon mockup icinde tarifler grid gorunumu
- Renkli yemek fotograflari gorunsun
- Arka plan: `#EEF6E8` veya hafif gradient

---

#### Screenshot 2 -- Yemek Plani

**Gosterilecek Ekran:** Haftalik yemek plani ekrani (plan.tsx)
**Overlay Metin:**

> **Haftalik Yemek Plani**
> Her gun icin ogle ve aksam planlama

**Kompozisyon Notlari:**
- Takvim/haftalik gorunumun acik oldugu ekran
- Renkli ogun kartlari gorunsun
- Arka plan: `#FAF8F5`

---

#### Screenshot 3 -- Tarif Detay

**Gosterilecek Ekran:** Tek bir tarifin detay sayfasi (recipe/ dizini)
**Overlay Metin:**

> **Adim Adim Tarifler**
> Malzeme listesi ve hazirlik adimlari

**Kompozisyon Notlari:**
- Guzel bir bebek yemegi fotografinin gorundugu tarif detay sayfasi
- Malzeme listesi ve beslenme bilgisi gorunmeli
- Arka plan: `#EEF6E8`

---

#### Screenshot 4 -- Alerjen Takibi

**Gosterilecek Ekran:** Kiler / alerjen takip ekrani (pantry.tsx)
**Overlay Metin:**

> **Alerjen Takibi**
> Guvenle yeni besinler tanitin

**Kompozisyon Notlari:**
- Besin ikonlari ve alerjen durum gostergeleri (yesil tik, sari uyari)
- Renkli ikon sistemi on plana cikmali
- Arka plan: `#E8F0FA` (acik mavi, guveni cagristiran)

---

#### Screenshot 5 -- Topluluk

**Gosterilecek Ekran:** Topluluk akisi (community.tsx)
**Overlay Metin:**

> **Annelerden Annelere**
> Deneyimlerinizi paylasin

**Kompozisyon Notlari:**
- Topluluk gonderileri, begeniler, yorumlar gorunsun
- Sosyal etkilesim hissiyati yaratin
- Arka plan: `#FAF8F5`

---

#### Screenshot 6 -- Bebek Profili

**Gosterilecek Ekran:** Profil / bebek bilgileri ekrani (profile.tsx)
**Overlay Metin:**

> **Bebeginize Ozel**
> Yas ve gelisime gore oneriler

**Kompozisyon Notlari:**
- Bebek profil karti, ay bilgisi, gelisim sureci
- Kisisellestirilmis deneyim hissi verin
- Arka plan: `#EEF6E8`

---

#### Screenshot 7 -- Mevsimsel Urunler (Opsiyonel)

**Gosterilecek Ekran:** Mevsimsel besinler veya taze urun takvimi
**Overlay Metin:**

> **Mevsiminde, Taze, Dogal**
> Hangi ayda hangi besin?

**Kompozisyon Notlari:**
- Renkli meyve/sebze ikonlari veya takvim gorunumu
- Arka plan: `#F5C0A0` hafif seftali tonu (cesitlilik icin)

---

#### Screenshot 8 -- Karanlik Mod (Opsiyonel)

**Gosterilecek Ekran:** Herhangi bir ekranin dark mode gorunumu
**Overlay Metin:**

> **Gece Beslemelerinde Goz Yormaz**
> Karanlik mod destegi

**Kompozisyon Notlari:**
- Karanlik temadaki uygulama gorunumu
- Arka plan: `#2A3A24` (sage koyu karanlik tema)

---

### Tablet Ekran Goruntuleri (7 inc ve 10 inc)

Telefon ekran goruntulerinin aynilari tablet cercevesi icinde sunulabilir. Ancak tablet icin ozel olarak:

- **7 inc tablet:** Telefon ile ayni dikey sablon kullanilabilir; mockup cercevesini tablet olarak degistirin
- **10 inc tablet:** Yatay gorunum kullanin. Split-screen duzeni idealdir: sol tarafta overlay metin, sag tarafta tablet mockup

Minimum Screenshot 1-4 arasi tablet icin de hazirlanmalidir.

---

## 3. Uygulama Ikonu (High-Res) -- ZORUNLU

### Teknik Ozellikler

| Ozellik        | Deger                                           |
| -------------- | ----------------------------------------------- |
| Boyut          | 512 x 512 px                                    |
| Format         | 32-bit PNG (alfa kanali ile)                     |
| Maksimum dosya | 1024 KB                                         |
| Sekil          | Google Play otomatik maskeleme uygular (daire)   |

### Mevcut Varliklar

Projede halihazirda asagidaki ikon dosyalari mevcuttur:

- `assets/icon.png` -- Ana uygulama ikonu
- `assets/android-icon-foreground.png` -- Adaptive icon on plan
- `assets/android-icon-background.png` -- Adaptive icon arka plan (`#A3BA91`)
- `assets/android-icon-monochrome.png` -- Tek renk versiyon

### Yapilacaklar

1. `assets/icon.png` dosyasini 512 x 512 px olarak disa aktarin (zaten bu boyutta olabilir; kontrol edin)
2. Google Play Console'un otomatik daire maskelemesini goz onunde bulundurun: ikon tasariminin merkezinde yeterli bosluk (padding) olmali
3. Ikonun `#A3BA91` arka plan uzerinde `android-icon-foreground.png` on planini icerdiginden emin olun
4. Ikonda metin varsa okunakliligini 48x48 px boyutunda bile kontrol edin

### Ikon Tasarim Kontrol Listesi

- [ ] 512 x 512 px PNG, 32-bit, alfa kanali ile
- [ ] Daire maskeleme sonrasi onemli ogeler kirilmiyor
- [ ] Kucuk boyutlarda (48px, 36px) hala tanimlabilir
- [ ] Play Store'daki beyaz ve koyu arka planda iyi gorunuyor
- [ ] Metinsiz veya metin minimal (marka ismi icin `K` veya kasik ikonu yeterli)

---

## 4. Tanitim Videosu (Promo Video) -- OPSIYONEL

### Teknik Ozellikler

| Ozellik          | Deger                                             |
| ---------------- | ------------------------------------------------- |
| Platform         | YouTube (herkese acik veya liste disI)             |
| Sure             | 30 saniye - 2 dakika (ideal: 30-60 sn)            |
| Cozunurluk       | 1080p minimum, 4K onerilen                        |
| En-boy orani     | 16:9 (yatay)                                      |
| Yas kisitlamasi  | "Cocuklar icin yapilmis" OLMAMALI (reklam kisitlar)|

### Video Senaryo Onerisi (45 saniye)

```
[0:00 - 0:05]  ACILIS
               Sage yesil gradient arka plan.
               Kasik logosu ortada belirir.
               Metin: "Bebeginizin Ek Gida Yolculugu Basliyor"

[0:05 - 0:12]  TARIFLER
               Telefon mockup icinde tarifler ekrani gorunur.
               Tarifler arasindan kaydirilir.
               Metin: "200+ Bebek Yemegi Tarifi"

[0:12 - 0:20]  YEMEK PLANI
               Gecis animasyonu ile yemek plani ekranina gecilir.
               Haftalik plan doldurulur.
               Metin: "Haftalik Yemek Plani Olusturun"

[0:20 - 0:28]  ALERJEN TAKIBI
               Alerjen ekranina gecis.
               Yeni besin eklenir, tik isaretlenir.
               Metin: "Alerjenleri Guvenle Takip Edin"

[0:28 - 0:35]  TOPLULUK
               Topluluk akisi gorunur.
               Gonderi paylasimi ve etkilesim.
               Metin: "Diger Ailelerle Deneyim Paylasin"

[0:35 - 0:45]  KAPANMA
               Uygulama ikonu + "Kasik" logosu.
               "Simdi Indirin" CTA butonu animasyonu.
               Play Store badge gorunur.
               Arka plan: #6B9B5E --> #4A7A42 gradient
```

### Video Yapilmamasi Gerekenler

- Gercek bebek goruntuleri kullanirken ebeveyn izni ve Google'in cocuk icerigi politikasina dikkat edin
- "Cocuklar icin yapilmis" programina dahil degilseniz, videoda dogrudan cocuklara hitap etmeyin
- Ucuncu parti muzik telif hakkina dikkat edin; telifsiz muzik kullanin

---

## 5. Tasarim Yonergeleri ve Gorsel Dil

### Renk Kullanim Kurallari

**Arka Plan Secenekleri (oncelik sirasina gore):**

1. `#EEF6E8` (Sage Soluk) -- birincil arka plan, cogu screenshot icin
2. `#FAF8F5` (Krem) -- ikincil arka plan, cesitlilik icin
3. `#6B9B5E` --> `#4A7A42` gradient -- Feature Graphic ve vurgu alanlari icin
4. `#E8F0FA` (Acik Mavi) -- alerjen/guven temasinda
5. `#F5C0A0` hafif seftali -- aksan, tek bir screenshot icin cesitlilik

**Metin Renkleri:**

| Durum                    | Renk      | Kullanim                        |
| ------------------------ | --------- | ------------------------------- |
| Koyu arka plan uzerinde  | `#FFFFFF` | Feature Graphic baslik          |
| Acik arka plan uzerinde  | `#2E2E1E` | Screenshot overlay basliklar    |
| Ikincil metin            | `#5A5A4A` | Screenshot overlay alt basliklar|
| Aksan/vurgu              | `#6B9B5E` | Anahtar kelimeler, ikonlar     |

### Tipografi Hiyerarsisi

| Seviye       | Boyut (telefon mockup disinda) | Agirlik   | Kullanim                     |
| ------------ | ------------------------------ | --------- | ---------------------------- |
| Baslik 1     | 48-56 pt                       | Bold      | Feature Graphic ana baslik   |
| Baslik 2     | 32-40 pt                       | SemiBold  | Screenshot overlay baslik    |
| Alt baslik   | 20-24 pt                       | Regular   | Screenshot overlay aciklama  |
| Etiket       | 16-18 pt                       | Medium    | Ozellik satiri, badge        |

### Gorsel Ogeler ve Dekorasyon

**Kullanilacak ogeler:**
- Yumusak kose yuvarlamalari (border-radius: 16-24 px)
- Hafif golge (drop shadow: 0 4px 12px rgba(0,0,0,0.08))
- Yiyecek ikonlari: havuc, brokoli, muz, elma, avokado (flat/outline stil)
- Kucuk yaprak veya bitki motifi (sage green tema ile uyumlu)
- Noktali veya dalgali dekoratif cizgiler

**Kullanilmayacak ogeler:**
- Keskin koseler veya agresif grafikler
- Neon veya parlak floresan renkler
- Karanlik veya soguk tonlar (screenshot 8 haric)
- Stok fotograf gorunumlu gercekci olmayan gorseller
- 3D rendering veya asiri golgeler

### Erisilebiirlik Kontrol Listesi

- [ ] Overlay metin ile arka plan arasinda minimum 4.5:1 kontrast orani
- [ ] Buyuk baslik metni icin minimum 3:1 kontrast orani
- [ ] Metin boyutu minimum 14 pt (overlay metinlerde)
- [ ] Renk koru kullanicilari icin: bilgi sadece renge bagli olmamali

---

## 6. Dosya Teslim Kontrol Listesi

### Zorunlu Dosyalar

```
google/
  feature-graphic.png          -- 1024 x 500 px, JPEG/PNG, alfa yok
  icon-512.png                 -- 512 x 512 px, 32-bit PNG
  screenshots/
    phone/
      01-tarifler.png          -- 1290 x 2796 px (veya 1080 x 1920)
      02-yemek-plani.png
      03-tarif-detay.png
      04-alerjen.png
      05-topluluk.png
      06-profil.png
      07-mevsimsel.png         -- opsiyonel
      08-karanlik-mod.png      -- opsiyonel
    tablet-7/
      01-tarifler.png          -- 1600 x 2560 px
      02-yemek-plani.png
      03-tarif-detay.png
      04-alerjen.png
    tablet-10/
      01-tarifler.png          -- 2560 x 1600 px
      02-yemek-plani.png
      03-tarif-detay.png
      04-alerjen.png
```

### Opsiyonel Dosyalar

```
google/
  promo-video.mp4              -- YouTube'a yuklenecek, link verilecek
  promo-video-thumbnail.png    -- 1280 x 720 px, YouTube thumbnail
```

### Genel Kalite Kontrol

- [ ] Tum dosyalar dogru boyut ve formatta
- [ ] Feature Graphic'te alfa kanali yok
- [ ] Turkce karakterler (s, c, g, i, o, u, I) dogru gorunuyor
- [ ] Tum metinler Play Store politikasina uygun (yaniltici ifade yok)
- [ ] Ekran goruntuleri gercek uygulama icerigini yansItiyor
- [ ] Ikon daire maskeleme sonrasi duzgun gorunuyor
- [ ] Telefon mockup cerceveleri guncel cihaz modellerini yansItiyor
- [ ] Minimum 2 telefon screenshot'i hazir (zorunlu)
- [ ] Feature Graphic hazir (zorunlu)
- [ ] 512x512 ikon hazir (zorunlu)

---

## 7. Google Play Console Yukleme Notlari

### Yukleme Sirasinda Dikkat Edilecekler

1. **Feature Graphic** --> Store Listing > Main store listing > Graphics > Feature graphic
2. **Ekran goruntuleri** --> Store Listing > Main store listing > Graphics > Phone screenshots (ve tablet)
3. **Ikon** --> Otomatik olarak app bundle'dan cekilir; ancak 512x512 versiyonu Store Listing'de de istenir
4. **Video** --> Store Listing > Main store listing > Graphics > Promo video (YouTube URL'si)

### Yerlestirme Lokalizasyonu

- Varsayilan dil: **Turkce (tr-TR)**
- Ikincil dil eklenecekse: Ingilizce ekran goruntuleri ayrica hazirlanmalidir
- Overlay metinler dile gore degiseceginden her dil icin ayri screenshot seti gerekir

---

*Bu belge, bir grafik tasarimcinin tum Google Play Store gorsellerini sifirdan uretebilmesi icin hazirlanmis kapsamli bir kreatif brief niteligindedir. Sorular icin uygulama icerisindeki gercek ekranlari referans alin ve marka renk paletinden sapmayin.*
