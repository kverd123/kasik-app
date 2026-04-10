/**
 * Kaşık — İçerik Moderasyon Sistemi
 * Topluluk gönderileri için sakıncalı içerik filtreleme
 */

// Küfür, hakaret, argo ve uygunsuz kelimeler (Türkçe)
const BLOCKED_WORDS = [
  // Küfürler ve hakaretler
  'amk', 'aq', 'amına', 'amını', 'sikeyim', 'sikerim', 'siktir', 'piç', 'orospu',
  'kahpe', 'kaltak', 'götveren', 'ibne', 'pezevenk', 'gavat', 'dangalak',
  'gerizekalı', 'salak', 'aptal', 'mal', 'hıyar', 'yarrak', 'yarak', 'taşak',
  'göt', 'meme', 'sik', 'am ', 'bok', 'hassiktir', 'lan', 'ulan',
  'döl', 'zıkkım', 'kodumun', 'kodoğlu',
  // Nefret söylemi
  'ırkçı', 'nazi', 'faşist', 'terörist',
  // Tehlikeli içerik (bebek uygulaması için)
  'intihar', 'öldür', 'zehir', 'tecavüz', 'istismar', 'pedofil',
  // İngilizce yaygın küfürler
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'nigger', 'faggot',
  'whore', 'slut', 'bastard', 'cunt', 'damn', 'wtf', 'stfu',
];

// Spam / reklam kalıpları
const SPAM_PATTERNS = [
  /https?:\/\/[^\s]+/gi,          // URL'ler
  /wa\.me\/\d+/gi,                // WhatsApp linkleri
  /t\.me\/\w+/gi,                 // Telegram linkleri
  /\d{10,}/g,                     // Uzun telefon numaraları
  /(?:dm|mesaj)\s*(?:at|yaz)/gi,  // DM yönlendirmeleri
  /(?:takip|follow)\s*(?:et|edin)/gi, // Takip isteği spam
];

/**
 * Metindeki sakıncalı kelimeleri kontrol et
 * @returns null = temiz, string = tespit edilen sorun açıklaması
 */
export const checkContent = (text: string): string | null => {
  if (!text || !text.trim()) return null;

  const normalizedText = text
    .toLowerCase()
    .replace(/[0-9]/g, (c) => {
      // Leet speak: 0→o, 1→i, 3→e, 4→a, 5→s, 7→t, 8→b
      const map: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' };
      return map[c] || c;
    })
    .replace(/[._\-*@!#$%^&()]/g, '') // Özel karakterleri temizle
    .replace(/\s+/g, ' ');

  // Yasaklı kelime kontrolü
  for (const word of BLOCKED_WORDS) {
    const pattern = new RegExp(`\\b${word.trim()}\\b`, 'i');
    if (pattern.test(normalizedText) || pattern.test(text.toLowerCase())) {
      return 'Gönderiniz uygunsuz veya hakaret içeren ifadeler içeriyor. Lütfen topluluk kurallarına uygun bir dille yeniden yazın.';
    }
  }

  // Spam kontrolü
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return 'Gönderilerde link, telefon numarası veya reklam içeriği paylaşılamaz.';
    }
  }

  // Tekrar eden karakter kontrolü (spam: "aaaaaaa", "!!!!!")
  if (/(.)\1{7,}/g.test(text)) {
    return 'Gönderiniz çok fazla tekrar eden karakter içeriyor.';
  }

  return null; // Temiz
};

/**
 * Birden fazla metin alanını kontrol et (post content + recipe title + steps)
 */
export const moderatePost = (content: string, recipeTitle?: string, steps?: string[]): string | null => {
  // Ana içerik
  const contentCheck = checkContent(content);
  if (contentCheck) return contentCheck;

  // Tarif başlığı
  if (recipeTitle) {
    const titleCheck = checkContent(recipeTitle);
    if (titleCheck) return titleCheck;
  }

  // Tarif adımları
  if (steps) {
    for (const step of steps) {
      const stepCheck = checkContent(step);
      if (stepCheck) return stepCheck;
    }
  }

  return null; // Tüm içerik temiz
};
