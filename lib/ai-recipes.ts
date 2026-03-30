/**
 * Kaşık — AI Recipe Engine
 * Generates baby food recipes based on pantry ingredients, baby age, and allergens.
 *
 * Supports: OpenAI GPT-4o-mini / Claude API / local fallback
 * Free users: 3 recipes/day | Premium: unlimited
 *
 * HOW IT WORKS:
 * 1. User's pantry items + baby profile → structured prompt
 * 2. AI generates recipe in strict JSON format
 * 3. Response parsed → Recipe object → displayed in app
 * 4. User can save AI recipes to their collection
 */

import { AgeStage, AllergenType, PantryItem, Recipe, Ingredient } from '../types';
import { getAllergenLabel } from '../constants/allergens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analytics } from './analytics';

// ===== CONFIGURATION =====

type AIProvider = 'openai' | 'claude' | 'gemini' | 'fallback';

const AI_CONFIG = {
  provider: 'gemini' as AIProvider,
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
  },
  claude: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
  },
  gemini: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
  },
  maxTokens: 1500,
  temperature: 0.7,
};

// ===== DAILY LIMIT TRACKING =====

const DAILY_LIMIT_KEY = 'kasik_ai_daily_count';
const FREE_DAILY_LIMIT = 3;

interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

export const getDailyUsage = async (): Promise<DailyUsage> => {
  try {
    const stored = await AsyncStorage.getItem(DAILY_LIMIT_KEY);
    if (stored) {
      const usage: DailyUsage = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      if (usage.date === today) return usage;
    }
    return { date: new Date().toISOString().split('T')[0], count: 0 };
  } catch {
    return { date: new Date().toISOString().split('T')[0], count: 0 };
  }
};

export const incrementDailyUsage = async (): Promise<DailyUsage> => {
  const usage = await getDailyUsage();
  usage.count += 1;
  await AsyncStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(usage));
  return usage;
};

export const canGenerateRecipe = async (isPremium: boolean): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> => {
  if (isPremium) return { allowed: true, remaining: Infinity, limit: Infinity };
  const usage = await getDailyUsage();
  const remaining = Math.max(0, FREE_DAILY_LIMIT - usage.count);
  return { allowed: remaining > 0, remaining, limit: FREE_DAILY_LIMIT };
};

// ===== PROMPT BUILDER =====

interface AIRecipeRequest {
  pantryItems: PantryItem[];
  babyAgeStage: AgeStage;
  knownAllergens: AllergenType[];
  babyName?: string;
  preferences?: string; // e.g. "sebze ağırlıklı", "demir zengini"
  mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'any';
  count?: number; // how many recipes to generate (1-3)
}

function buildPrompt(request: AIRecipeRequest): string {
  const ageLabel = request.babyAgeStage === '6m' ? '6 aylık'
    : request.babyAgeStage === '8m' ? '8 aylık' : '12 ay ve üzeri';

  const allergenList = request.knownAllergens.length > 0
    ? request.knownAllergens.map(getAllergenLabel).join(', ')
    : 'bilinen alerjen yok';

  const pantryList = request.pantryItems
    .map((item) => `${item.emoji} ${item.name}`)
    .join(', ');

  const mealLabel = request.mealType === 'breakfast' ? 'kahvaltı'
    : request.mealType === 'lunch' ? 'öğle yemeği'
    : request.mealType === 'snack' ? 'ara öğün'
    : request.mealType === 'dinner' ? 'akşam yemeği'
    : 'herhangi bir öğün';

  const count = request.count || 1;

  return `Sen bir bebek beslenme uzmanısın. Türk mutfağına uygun, ${ageLabel} bir bebek için güvenli ve besleyici tarif(ler) oluştur.

KURALLAR:
- Tarif ${ageLabel} bebek için güvenli olmalı
- Tuz, şeker, bal (1 yaş altı), tam inek sütü (1 yaş altı) KULLANMA
- ${allergenList.includes('yok') ? 'Bilinen alerjen yok, tüm besinler kullanılabilir' : `ŞU ALERJENLERİ İÇEREN MALZEMELERİ KULLANMA: ${allergenList}`}
- Sadece dolaptaki malzemeleri kullan (ek olarak temel mutfak malzemeleri: zeytinyağı, su, toz tarçın kullanabilirsin)
- Porsiyon bebek porsiyonu olsun (50-150g arası)
- Besin değerlerini yaklaşık hesapla
- Doku/kıvam ${request.babyAgeStage === '6m' ? 'tamamen pürüzsüz püre' : request.babyAgeStage === '8m' ? 'hafif parçacıklı, ezme kıvamında' : 'parmak besin veya küçük parçalar'} olmalı

DOLAPTAKİ MALZEMELER:
${pantryList}

${request.preferences ? `TERCİH: ${request.preferences}` : ''}
ÖĞÜN TİPİ: ${mealLabel}
${request.babyName ? `BEBEĞİN ADI: ${request.babyName}` : ''}

${count} adet tarif oluştur. Her tarif için aşağıdaki JSON formatını kullan.
Yanıtını SADECE JSON olarak ver, başka metin ekleme.

${count === 1 ? 'JSON formatı:' : 'JSON array formatı:'}
${count === 1 ? `{
  "title": "Tarif adı",
  "description": "Kısa açıklama (1 cümle)",
  "emoji": "🥣",
  "ageGroup": "${request.babyAgeStage}",
  "prepTime": 15,
  "calories": 85,
  "servings": 1,
  "difficulty": "easy",
  "ingredients": [
    { "name": "Malzeme adı", "amount": 1, "unit": "adet", "emoji": "🥕" }
  ],
  "steps": [
    "Adım 1: ...",
    "Adım 2: ..."
  ],
  "allergens": [],
  "nutrients": [
    { "name": "Demir", "value": 2, "unit": "mg" }
  ],
  "tags": ["Kolay", "Demir ↑"],
  "tip": "Ebeveyn için kısa bir ipucu veya bilgi"
}` : `[
  { ...tarif1 },
  { ...tarif2 }
]`}`;
}

// ===== AI API CALLS =====

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch(AI_CONFIG.openai.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.openai.model,
      messages: [
        {
          role: 'system',
          content: 'Sen bir çocuk beslenme uzmanısın. Yanıtlarını her zaman geçerli JSON formatında ver. Türkçe yanıt ver.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API hatası: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callClaude(prompt: string): Promise<string> {
  const response = await fetch(AI_CONFIG.claude.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_CONFIG.claude.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_CONFIG.claude.model,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        { role: 'user', content: prompt },
      ],
      system: 'Sen bir çocuk beslenme uzmanısın. Yanıtlarını her zaman geçerli JSON formatında ver. Türkçe yanıt ver.',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API hatası: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `${AI_CONFIG.gemini.apiUrl}?key=${AI_CONFIG.gemini.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Sen bir çocuk beslenme uzmanısın. Yanıtlarını her zaman geçerli JSON formatında ver. Türkçe yanıt ver.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: AI_CONFIG.temperature,
          maxOutputTokens: AI_CONFIG.maxTokens,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API hatası: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ===== FALLBACK RECIPES (offline / no API key) =====

function getFallbackRecipes(request: AIRecipeRequest): AIRecipeResult[] {
  const pantryNames = request.pantryItems.map((p) => p.name.toLowerCase());

  const fallbackDB: AIRecipeResult[] = [
    {
      title: 'Havuç-Patates Püresi',
      description: 'Klasik ve besleyici bir başlangıç püresi',
      emoji: '🥕',
      ageGroup: '6m',
      prepTime: 20,
      calories: 65,
      servings: 1,
      difficulty: 'easy',
      ingredients: [
        { name: 'Havuç', amount: 1, unit: 'adet', emoji: '🥕' },
        { name: 'Patates', amount: 0.5, unit: 'adet', emoji: '🥔' },
        { name: 'Zeytinyağı', amount: 1, unit: 'çay kaşığı', emoji: '🫒' },
      ],
      steps: [
        'Havuç ve patatesi soyun, küçük küpler halinde doğrayın.',
        'Buharda veya kaynar suda 15 dakika pişirin.',
        'Blender ile pürüzsüz kıvama getirin.',
        'Zeytinyağı ekleyip karıştırın.',
      ],
      allergens: [],
      nutrients: [
        { name: 'A Vitamini', value: 120, unit: 'mcg' },
        { name: 'C Vitamini', value: 8, unit: 'mg' },
      ],
      tags: ['Kolay', 'A Vitamini'],
      tip: 'İlk günlerde tek malzeme ile başlayıp yavaş yavaş karıştırabilirsiniz.',
    },
    {
      title: 'Elmalı Yulaf Lapası',
      description: 'Tatlı ve lif açısından zengin kahvaltı',
      emoji: '🍎',
      ageGroup: '6m',
      prepTime: 10,
      calories: 95,
      servings: 1,
      difficulty: 'easy',
      ingredients: [
        { name: 'Yulaf', amount: 2, unit: 'yemek kaşığı', emoji: '🥣' },
        { name: 'Elma', amount: 0.5, unit: 'adet', emoji: '🍎' },
        { name: 'Su', amount: 100, unit: 'ml', emoji: '💧' },
      ],
      steps: [
        'Elmayı soyun, rendeleyin.',
        'Yulafı su ile karıştırıp kısık ateşte 5 dakika pişirin.',
        'Rendelenmiş elmayı ekleyip 2 dakika daha pişirin.',
        'Kıvamına göre su ekleyerek ayarlayın.',
      ],
      allergens: ['wheat'],
      nutrients: [
        { name: 'Lif', value: 3, unit: 'g' },
        { name: 'Demir', value: 1.5, unit: 'mg' },
      ],
      tags: ['Kolay', 'Lif', 'Kahvaltı'],
      tip: 'Yulaf gluten içerir, ilk denemede az miktarla başlayın.',
    },
    {
      title: 'Mercimek Çorbası (Bebek)',
      description: 'Demir ve protein deposu klasik Türk çorbası',
      emoji: '🫘',
      ageGroup: '6m',
      prepTime: 30,
      calories: 85,
      servings: 2,
      difficulty: 'easy',
      ingredients: [
        { name: 'Kırmızı Mercimek', amount: 3, unit: 'yemek kaşığı', emoji: '🫘' },
        { name: 'Havuç', amount: 0.5, unit: 'adet', emoji: '🥕' },
        { name: 'Patates', amount: 0.5, unit: 'adet', emoji: '🥔' },
        { name: 'Zeytinyağı', amount: 1, unit: 'çay kaşığı', emoji: '🫒' },
        { name: 'Su', amount: 200, unit: 'ml', emoji: '💧' },
      ],
      steps: [
        'Mercimeği yıkayın. Havuç ve patatesi küçük doğrayın.',
        'Tüm malzemeleri tencereye koyup su ekleyin.',
        'Kısık ateşte 25 dakika, mercimek ve sebzeler yumuşayana kadar pişirin.',
        'Blender ile pürüzsüz yapın. Zeytinyağı ekleyin.',
      ],
      allergens: [],
      nutrients: [
        { name: 'Demir', value: 3, unit: 'mg' },
        { name: 'Protein', value: 5, unit: 'g' },
        { name: 'Lif', value: 4, unit: 'g' },
      ],
      tags: ['Demir ↑', 'Protein', 'Türk Mutfağı'],
      tip: 'Mercimek çorbası dondurucuda 1 ay saklanabilir. Buz kalıplarına döküp porsiyon porsiyon dondurun.',
    },
    {
      title: 'Muzlu Avokado Ezmesi',
      description: 'Sağlıklı yağlar ve potasyum deposu',
      emoji: '🥑',
      ageGroup: '6m',
      prepTime: 5,
      calories: 120,
      servings: 1,
      difficulty: 'easy',
      ingredients: [
        { name: 'Avokado', amount: 0.25, unit: 'adet', emoji: '🥑' },
        { name: 'Muz', amount: 0.5, unit: 'adet', emoji: '🍌' },
      ],
      steps: [
        'Avokadonun içini çıkarın.',
        'Muzu soyun.',
        'Çatalla iyice ezin veya blender ile karıştırın.',
        'Hemen servis edin (avokado kararır).',
      ],
      allergens: [],
      nutrients: [
        { name: 'Potasyum', value: 300, unit: 'mg' },
        { name: 'Sağlıklı Yağ', value: 5, unit: 'g' },
      ],
      tags: ['Kolay', 'Pişirme Yok', 'Sağlıklı Yağ'],
      tip: 'Avokado çok hızlı kararır, hazırladıktan sonra bekletmeyin.',
    },
    {
      title: 'Tavuklu Sebze Püresi',
      description: 'Protein ve sebze karışımı doyurucu öğün',
      emoji: '🍗',
      ageGroup: '8m',
      prepTime: 30,
      calories: 110,
      servings: 2,
      difficulty: 'medium',
      ingredients: [
        { name: 'Tavuk Göğsü', amount: 30, unit: 'g', emoji: '🍗' },
        { name: 'Kabak', amount: 0.5, unit: 'adet', emoji: '🎃' },
        { name: 'Havuç', amount: 0.5, unit: 'adet', emoji: '🥕' },
        { name: 'Zeytinyağı', amount: 1, unit: 'çay kaşığı', emoji: '🫒' },
      ],
      steps: [
        'Tavuğu haşlayın (20 dk). Bol köpüğünü alın.',
        'Kabak ve havucu küçük doğrayıp buharda pişirin.',
        'Tüm malzemeleri birlikte blenderdan geçirin.',
        'Kıvamını haşlama suyuyla ayarlayın, zeytinyağı ekleyin.',
      ],
      allergens: [],
      nutrients: [
        { name: 'Protein', value: 8, unit: 'g' },
        { name: 'Demir', value: 1, unit: 'mg' },
        { name: 'A Vitamini', value: 80, unit: 'mcg' },
      ],
      tags: ['Protein', 'Doyurucu', 'Öğle Yemeği'],
      tip: '8 aydan önce tavuğu çok ince çekilmiş olarak verin, parça bırakmayın.',
    },
    {
      title: 'Ispanaklı Yumurta',
      description: 'Demir emilimini artıran mükemmel ikili',
      emoji: '🥬',
      ageGroup: '8m',
      prepTime: 15,
      calories: 95,
      servings: 1,
      difficulty: 'easy',
      ingredients: [
        { name: 'Yumurta', amount: 1, unit: 'adet (sarısı)', emoji: '🥚' },
        { name: 'Ispanak', amount: 3, unit: 'yaprak', emoji: '🥬' },
        { name: 'Tereyağı', amount: 0.5, unit: 'çay kaşığı', emoji: '🧈' },
      ],
      steps: [
        'Ispanakları yıkayıp ince kıyın, 2 dk soteleyin.',
        'Yumurta sarısını (veya tam yumurta 12ay+) çırpın.',
        'Tereyağında kısık ateşte yavaşça pişirin.',
        'Ispanakla karıştırıp ezin.',
      ],
      allergens: ['egg', 'milk'],
      nutrients: [
        { name: 'Demir', value: 3, unit: 'mg' },
        { name: 'Protein', value: 6, unit: 'g' },
        { name: 'D Vitamini', value: 1, unit: 'mcg' },
      ],
      tags: ['Demir ↑', 'Protein', 'Hızlı'],
      tip: 'C vitamini kaynağı (limon damlası) eklemek demirin emilimini 3 kat artırır.',
    },
    {
      title: 'Tatlı Patates & Elma Püresi',
      description: 'Doğal tatlılıkta, A vitamini deposu',
      emoji: '🍠',
      ageGroup: '6m',
      prepTime: 25,
      calories: 100,
      servings: 2,
      difficulty: 'easy',
      ingredients: [
        { name: 'Tatlı Patates', amount: 1, unit: 'küçük', emoji: '🍠' },
        { name: 'Elma', amount: 0.5, unit: 'adet', emoji: '🍎' },
        { name: 'Tarçın', amount: 1, unit: 'tutam', emoji: '🫙' },
      ],
      steps: [
        'Tatlı patatesi soyun, küçük küpler halinde kesin.',
        'Elmayı soyup küçük doğrayın.',
        'Buharda 15-20 dakika pişirin.',
        'Bir tutam tarçın ekleyip püre yapın.',
      ],
      allergens: [],
      nutrients: [
        { name: 'A Vitamini', value: 200, unit: 'mcg' },
        { name: 'Lif', value: 3, unit: 'g' },
        { name: 'C Vitamini', value: 12, unit: 'mg' },
      ],
      tags: ['Kolay', 'A Vitamini', 'Doğal Tatlı'],
      tip: 'Tatlı patates kendi doğal tatlılığıyla bebekler tarafından çok sevilir, şeker eklemeye gerek yok.',
    },
    {
      title: 'Brokoli & Peynirli Ezme',
      description: 'Kalsiyum ve C vitamini kombinasyonu',
      emoji: '🥦',
      ageGroup: '8m',
      prepTime: 15,
      calories: 80,
      servings: 1,
      difficulty: 'easy',
      ingredients: [
        { name: 'Brokoli', amount: 3, unit: 'çiçek', emoji: '🥦' },
        { name: 'Taze Peynir', amount: 1, unit: 'yemek kaşığı', emoji: '🧀' },
        { name: 'Zeytinyağı', amount: 0.5, unit: 'çay kaşığı', emoji: '🫒' },
      ],
      steps: [
        'Brokoli çiçeklerini buharda 8-10 dakika pişirin.',
        'Çatalla iyice ezin (8ay+ için parçacıklı bırakabilirsiniz).',
        'Taze peynir ve zeytinyağı ekleyip karıştırın.',
      ],
      allergens: ['milk'],
      nutrients: [
        { name: 'Kalsiyum', value: 80, unit: 'mg' },
        { name: 'C Vitamini', value: 35, unit: 'mg' },
        { name: 'Demir', value: 1, unit: 'mg' },
      ],
      tags: ['Kalsiyum', 'C Vitamini', 'Hızlı'],
      tip: 'Brokoli saplarını da kullanabilirsiniz, daha fazla lif içerir.',
    },
  ];

  // Filter by age compatibility
  const ageOrder = { '6m': 0, '8m': 1, '12m+': 2 };
  const stageLevel = ageOrder[request.babyAgeStage];

  let compatible = fallbackDB.filter((r) => {
    // Age check
    if (ageOrder[r.ageGroup as AgeStage] > stageLevel) return false;
    // Allergen check
    if (request.knownAllergens.length > 0) {
      const hasAllergen = r.allergens.some((a) =>
        request.knownAllergens.includes(a as AllergenType)
      );
      if (hasAllergen) return false;
    }
    return true;
  });

  // Prioritize recipes that use pantry items
  if (pantryNames.length > 0) {
    compatible.sort((a, b) => {
      const aMatch = a.ingredients.filter((i) =>
        pantryNames.some((p) => i.name.toLowerCase().includes(p))
      ).length;
      const bMatch = b.ingredients.filter((i) =>
        pantryNames.some((p) => i.name.toLowerCase().includes(p))
      ).length;
      return bMatch - aMatch;
    });
  }

  return compatible.slice(0, request.count || 1);
}

// ===== RESPONSE PARSER =====

export interface AIRecipeResult {
  title: string;
  description: string;
  emoji: string;
  ageGroup: string;
  prepTime: number;
  calories: number;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  steps: string[];
  allergens: string[];
  nutrients: { name: string; value: number; unit: string }[];
  tags: string[];
  tip: string;
}

function parseAIResponse(responseText: string): AIRecipeResult[] {
  try {
    // Clean response - remove markdown code blocks if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // Handle single recipe or array
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [parsed];
  } catch (error) {
    console.error('AI yanıtı parse edilemedi:', error);
    throw new Error('AI yanıtı anlaşılamadı. Lütfen tekrar deneyin.');
  }
}

// ===== MAIN FUNCTION =====

/**
 * Generate recipe(s) using AI based on pantry and baby profile
 */
export async function generateAIRecipes(request: AIRecipeRequest): Promise<AIRecipeResult[]> {
  const prompt = buildPrompt(request);

  try {
    let responseText: string;

    switch (AI_CONFIG.provider) {
      case 'openai':
        if (!AI_CONFIG.openai.apiKey) {
          console.log('OpenAI API key yok, fallback tarifler kullanılıyor...');
          return getFallbackRecipes(request);
        }
        responseText = await callOpenAI(prompt);
        break;

      case 'claude':
        if (!AI_CONFIG.claude.apiKey) {
          console.log('Claude API key yok, fallback tarifler kullanılıyor...');
          return getFallbackRecipes(request);
        }
        responseText = await callClaude(prompt);
        break;

      case 'gemini':
        if (!AI_CONFIG.gemini.apiKey) {
          console.log('Gemini API key yok, fallback tarifler kullanılıyor...');
          return getFallbackRecipes(request);
        }
        responseText = await callGemini(prompt);
        break;

      case 'fallback':
      default:
        return getFallbackRecipes(request);
    }

    const recipes = parseAIResponse(responseText);
    analytics.aiRecipeGenerate(AI_CONFIG.provider, recipes.length);
    return recipes;
  } catch (error) {
    console.error('AI tarif oluşturma hatası:', error);
    // Fallback to local recipes on error
    return getFallbackRecipes(request);
  }
}

/**
 * Convert AI result to a full Recipe object for saving to Firestore
 */
export function aiResultToRecipe(
  result: AIRecipeResult,
  userId: string,
  userName: string
): Omit<Recipe, 'id'> {
  return {
    title: result.title,
    description: result.description,
    emoji: result.emoji,
    photoURL: undefined,
    photoGallery: [],
    authorId: userId,
    authorName: userName,
    authorVerified: false,
    ageGroup: result.ageGroup as AgeStage,
    prepTime: result.prepTime,
    calories: result.calories,
    servings: result.servings,
    ingredients: result.ingredients,
    steps: result.steps,
    allergens: result.allergens as AllergenType[],
    nutrients: result.nutrients,
    difficulty: result.difficulty as 'easy' | 'medium' | 'hard',
    tags: [...result.tags, 'AI Önerisi'],
    likes: 0,
    likedBy: [],
    rating: { average: 0, count: 0 },
    isAIGenerated: true,
    source: 'ai',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Quick suggestion: get recipe names based on pantry (no full generation)
 */
export function getQuickSuggestions(
  pantryItems: PantryItem[],
  babyAgeStage: AgeStage,
  knownAllergens: AllergenType[]
): { title: string; emoji: string; matchCount: number }[] {
  const results = getFallbackRecipes({
    pantryItems,
    babyAgeStage,
    knownAllergens,
    count: 5,
  });

  const pantryNames = pantryItems.map((p) => p.name.toLowerCase());

  return results.map((r) => ({
    title: r.title,
    emoji: r.emoji,
    matchCount: r.ingredients.filter((i) =>
      pantryNames.some((p) => i.name.toLowerCase().includes(p))
    ).length,
  }));
}
