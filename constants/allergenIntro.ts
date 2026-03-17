/**
 * Kaşık — Allergen Introduction Constants
 * Alerjen açma programı tipleri, semptomlar, şablonlar
 */

import { AllergenType, MealSlot } from '../types';

// ===== TİPLER =====

export interface AllergenIntroProgramConfig {
  id: string;
  allergenType: AllergenType;
  customAllergenName?: string; // allergenType === 'other' ise kullanıcının girdiği isim
  totalDays: number;
  mealsPerDay: number;
  startDate: Date;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  dailyPlan: AllergenIntroDayPlan[];
}

export interface AllergenIntroDayPlan {
  day: number;
  meals: AllergenIntroMeal[];
}

export interface AllergenIntroMeal {
  id: string;
  slot: MealSlot;
  recipeName: string;
  emoji: string;
  completed: boolean;
  reaction?: AllergenReactionResult;
}

export interface AllergenReactionResult {
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  notes: string;
  timestamp: Date;
}

export interface AllergenProgramReport {
  programId: string;
  allergenType: AllergenType;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  totalMeals: number;
  completedMeals: number;
  reactions: AllergenReactionResult[];
  overallResult: 'safe' | 'caution' | 'allergic' | 'in_progress';
}

// ===== SEMPTOMLAR =====

export const ALLERGEN_SYMPTOMS = [
  { id: 'rash', label: 'Döküntü / Kızarıklık', emoji: '🔴' },
  { id: 'swelling', label: 'Şişlik', emoji: '😮' },
  { id: 'vomiting', label: 'Kusma', emoji: '🤢' },
  { id: 'diarrhea', label: 'İshal', emoji: '💧' },
  { id: 'breathing', label: 'Nefes Darlığı', emoji: '😤' },
  { id: 'hives', label: 'Ürtiker (Kurdeşen)', emoji: '🟡' },
  { id: 'eczema', label: 'Egzama Alevlenmesi', emoji: '🩹' },
  { id: 'colic', label: 'Kolik / Karın Ağrısı', emoji: '😢' },
  { id: 'congestion', label: 'Burun Tıkanıklığı', emoji: '🤧' },
  { id: 'anaphylaxis', label: 'Anafilaksi Belirtileri', emoji: '🚨' },
];

// ===== ÖRNEK PROGRAM ŞABLONLARI =====

export interface AllergenRecipeTemplate {
  recipeName: string;
  emoji: string;
  description: string;
}

export const ALLERGEN_PROGRAM_TEMPLATES: Record<string, AllergenRecipeTemplate[]> = {
  egg: [
    { recipeName: 'Fırında Kek (Yumurtalı)', emoji: '🍰', description: 'Pişmiş yumurta, en düşük risk' },
    { recipeName: 'Krep', emoji: '🥞', description: 'Yumurta ile hazırlanmış krep' },
    { recipeName: 'Haşlanmış Yumurta Sarısı', emoji: '🥚', description: 'Direkt yumurta maruziyeti' },
  ],
  milk: [
    { recipeName: 'Pişmiş Peynirli Börek', emoji: '🧀', description: 'Pişmiş süt proteini, düşük risk' },
    { recipeName: 'Yoğurt', emoji: '🥛', description: 'Fermente süt ürünü' },
    { recipeName: 'Süt (Soğuk)', emoji: '🥛', description: 'Direkt süt maruziyeti' },
  ],
  wheat: [
    { recipeName: 'Pişmiş Ekmek', emoji: '🍞', description: 'Pişmiş gluten' },
    { recipeName: 'Makarna', emoji: '🍝', description: 'Buğday bazlı gıda' },
    { recipeName: 'Yulaf Lapası', emoji: '🥣', description: 'Tahıl bazlı' },
  ],
  peanut: [
    { recipeName: 'Fıstık Ezmesi (Az)', emoji: '🥜', description: 'Çok az miktarda başla' },
    { recipeName: 'Fıstıklı Kurabiye', emoji: '🍪', description: 'Pişmiş formda' },
    { recipeName: 'Fıstık Ezmesi Püresi', emoji: '🥜', description: 'Artan miktar' },
  ],
  soy: [
    { recipeName: 'Tofu Püresi', emoji: '🫘', description: 'Yumuşak tofu' },
    { recipeName: 'Soya Sütlü Lapa', emoji: '🥣', description: 'Soya sütü ile' },
    { recipeName: 'Edamame Püresi', emoji: '🫛', description: 'Bütün soya fasulyesi' },
  ],
  tree_nut: [
    { recipeName: 'Badem Unu Kurabiye', emoji: '🌰', description: 'Pişmiş formda' },
    { recipeName: 'Fındık Ezmesi', emoji: '🌰', description: 'Az miktarda' },
    { recipeName: 'Cevizli Yoğurt', emoji: '🥣', description: 'Artan miktar' },
  ],
  fish: [
    { recipeName: 'Fırında Balık Püresi', emoji: '🐟', description: 'İyi pişmiş balık' },
    { recipeName: 'Balıklı Çorba', emoji: '🍲', description: 'Çorbada balık' },
    { recipeName: 'Buğulama Balık', emoji: '🐟', description: 'Artan miktar' },
  ],
  shellfish: [
    { recipeName: 'Karides Püresi (Az)', emoji: '🦐', description: 'Çok az miktarda' },
    { recipeName: 'Karidesli Çorba', emoji: '🍲', description: 'Çorbada karides' },
    { recipeName: 'Buğulama Karides', emoji: '🦐', description: 'Artan miktar' },
  ],
  sesame: [
    { recipeName: 'Tahin (Çok Az)', emoji: '🫓', description: 'Seyreltilmiş tahin' },
    { recipeName: 'Tahinli Lapa', emoji: '🥣', description: 'Tahinli yulaf lapası' },
    { recipeName: 'Susamlı Ekmek', emoji: '🫓', description: 'Susamlı ürün' },
  ],
};

// ===== UYARILAR =====

export const DISCLAIMER_TEXT =
  'Alerjen açma süreci tamamen bireysel bir yaklaşımdır. Bu program yalnızca bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Alerjen açma işlemi asla doktor kontrolü dışında denenmemelidir. Ciddi alerjik reaksiyon (anafilaksi) durumunda derhal 112\'yi arayın.';

export const STOP_WARNING_TEXT =
  'Aşağıdaki belirtilerden herhangi birini gözlemlerseniz, programı derhal durdurun ve doktorunuza başvurun:\n\n• Ciddi döküntü veya şişlik\n• Nefes darlığı veya hırıltılı solunum\n• Kusma (tekrarlayan)\n• Yüz, dudak veya dil şişmesi\n• Halsizlik, bilinç bulanıklığı';

export const SEVERITY_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  none: { label: 'Reaksiyon Yok', color: '#4CAF50', emoji: '✅' },
  mild: { label: 'Hafif', color: '#FF9800', emoji: '⚠️' },
  moderate: { label: 'Orta', color: '#FF5722', emoji: '🟠' },
  severe: { label: 'Ciddi', color: '#F44336', emoji: '🚨' },
};
