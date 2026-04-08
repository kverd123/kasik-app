/**
 * Kaşık — Community Store (Zustand)
 * Topluluk gönderileri, beğeniler, yorumlar — AsyncStorage ile persist
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debouncedSetItem } from '../lib/debouncedStorage';
import { PostCategory } from '../components/community/CreatePostModal';
import { getAuthUserId } from '../lib/firestoreSync';
import {
  createPost as firestoreCreatePost,
  getPosts as firestoreGetPosts,
  togglePostLike as firestoreTogglePostLike,
  addComment as firestoreAddComment,
  getPostLikeStatuses,
  deletePostFromFirestore,
} from '../lib/firestore';

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  avatarBg: string;
  time: string;
  text: string;
  likes: number;
  isLiked: boolean;
  isVerified: boolean;
  replies?: CommunityComment[];
}

export interface CommunityPost {
  id: string;
  authorId?: string;
  author: string;
  avatar: string;
  avatarBg: string;
  badge: 'verified' | null;
  category: PostCategory;
  time: string;
  babyAge: string;
  content: string;
  photos: string[];
  photoLabel?: string;
  likes: number;
  views: number;
  comments: CommunityComment[];
  isLiked: boolean;
  hasRecipe: boolean;
  recipeId?: string;
  isVerified: boolean;
  hasArticle?: boolean;
  articleTitle?: string;
  articleSubtitle?: string;
  topComment?: { author: string; avatar: string; text: string };
  createdAt: Date;
}

interface CommunityState {
  posts: CommunityPost[];
  blockedUserIds: string[];
  hiddenPostIds: string[];
  isLoaded: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPostDoc: any | null;

  loadFromStorage: () => Promise<void>;
  loadPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  addPost: (post: CommunityPost) => void;
  deletePost: (postId: string) => void;
  hidePost: (postId: string) => void;
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, comment: CommunityComment) => void;
  addReply: (postId: string, commentId: string, reply: CommunityComment) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  getPostById: (id: string) => CommunityPost | undefined;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
  getFilteredPosts: () => CommunityPost[];
}

const STORAGE_KEY = '@kasik_community';
const BLOCKED_USERS_KEY = '@kasik_blocked_users';

const persistToStorage = (posts: CommunityPost[]) => {
  try {
    debouncedSetItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Topluluk kaydedilemedi:', e);
  }
};

const mapFirestorePost = (p: any): CommunityPost => ({
  id: p.id,
  authorId: p.authorId,
  author: p.authorName || p.author || 'Anonim',
  avatar: p.avatar || '👤',
  avatarBg: p.avatarBg || '#E0E0E0',
  badge: p.isVerified ? 'verified' : null,
  category: p.category || 'experience',
  time: '',
  babyAge: p.babyAge || '',
  content: p.content || '',
  photos: p.photos || [],
  photoLabel: p.photoLabel,
  likes: p.likes || 0,
  views: p.views || 0,
  comments: [],
  isLiked: false,
  hasRecipe: p.hasRecipe || false,
  recipeId: p.recipeId,
  isVerified: p.isVerified || false,
  createdAt: p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt),
});

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: 'Ayşe Yılmaz',
    avatar: '👩',
    avatarBg: '#E8D8C0',
    badge: null,
    category: 'recipe',
    time: '2 saat önce',
    babyAge: '8 aylık bebek',
    content: 'Bugün ilk kez brokoli denedik ve çok sevdi! Tarifi paylaşıyorum...',
    photos: ['🥦🍚'],
    photoLabel: 'Brokoli & Pirinç Püresi',
    likes: 42,
    views: 280,
    isLiked: true,
    hasRecipe: true,
    recipeId: '2',
    isVerified: false,
    createdAt: hoursAgo(2),
    comments: [
      {
        id: 'c1',
        author: 'Mehmet K.',
        avatar: '👨',
        avatarBg: '#D0E0C8',
        time: '1 saat önce',
        text: 'Harika görünüyor! Kaç dk pişirdin?',
        likes: 5,
        isLiked: false,
        isVerified: false,
        replies: [
          {
            id: 'c1r1',
            author: 'Ayşe Yılmaz',
            avatar: '👩',
            avatarBg: '#E8D8C0',
            time: '45 dk önce',
            text: 'Buharla 10 dakika pişirdim, yumuşacık oldu 😊',
            likes: 3,
            isLiked: false,
            isVerified: false,
          },
        ],
      },
      {
        id: 'c2',
        author: 'Dr. Elif Demir',
        avatar: '👨‍⚕️',
        avatarBg: '#D0D8F0',
        time: '30 dk önce',
        text: 'Brokoli demir açısından çok zengin, C vitamini ile birlikte verilince emilim artar.',
        likes: 18,
        isLiked: true,
        isVerified: true,
      },
      {
        id: 'c3',
        author: 'Zeynep A.',
        avatar: '👩‍🦰',
        avatarBg: '#F0D8E0',
        time: '15 dk önce',
        text: 'Biz de yarın deneyeceğiz, teşekkürler paylaşım için!',
        likes: 2,
        isLiked: false,
        isVerified: false,
      },
      {
        id: 'c4',
        author: 'Selin T.',
        avatar: '👩‍🦱',
        avatarBg: '#E0D8F0',
        time: '5 dk önce',
        text: 'Bizim bebek brokoli sevmedi ama patatesle karıştırınca yedi.',
        likes: 7,
        isLiked: false,
        isVerified: false,
      },
    ],
    topComment: {
      author: 'Mehmet K.',
      avatar: '👨',
      text: 'Harika görünüyor! Kaç dk pişirdin?',
    },
  },
  {
    id: '2',
    author: 'Dr. Elif Demir',
    avatar: '👨‍⚕️',
    avatarBg: '#D0D8F0',
    badge: 'verified',
    category: 'tip',
    time: '5 saat önce',
    babyAge: 'Çocuk Beslenme Uzmanı',
    content: 'Alerjen takibinde dikkat edilmesi gereken 5 önemli nokta:',
    photos: [],
    likes: 128,
    views: 920,
    isLiked: false,
    hasRecipe: false,
    hasArticle: true,
    articleTitle: 'Alerjen Takip Rehberi',
    articleSubtitle: 'Yeni besinleri güvenle tanıtmak için...',
    isVerified: true,
    createdAt: hoursAgo(5),
    comments: [
      {
        id: 'c1',
        author: 'Ayşe Yılmaz',
        avatar: '👩',
        avatarBg: '#E8D8C0',
        time: '4 saat önce',
        text: 'Hocam yumurta sarısı 6. ayda verilebilir mi?',
        likes: 12,
        isLiked: false,
        isVerified: false,
        replies: [
          {
            id: 'c1r1',
            author: 'Dr. Elif Demir',
            avatar: '👨‍⚕️',
            avatarBg: '#D0D8F0',
            time: '3 saat önce',
            text: 'Güncel kılavuzlara göre 6. aydan itibaren verilebilir. Erken tanıtım alerji riskini azaltabilir.',
            likes: 24,
            isLiked: true,
            isVerified: true,
          },
        ],
      },
      {
        id: 'c2',
        author: 'Fatma Çelik',
        avatar: '👩‍🦱',
        avatarBg: '#F0D8E0',
        time: '2 saat önce',
        text: 'Çok faydalı bilgiler, teşekkürler! Kaydettim 🙏',
        likes: 4,
        isLiked: false,
        isVerified: false,
      },
    ],
  },
  {
    id: '3',
    author: 'Fatma Çelik',
    avatar: '👩‍🦱',
    avatarBg: '#F0D8E0',
    badge: null,
    category: 'experience',
    time: '1 gün önce',
    babyAge: '10 aylık bebek',
    content: 'BLW yöntemiyle ilk parmak besinler! Havuç çubukları ve avokado dilimleri denedik 🥑',
    photos: ['🥕✋'],
    photoLabel: 'BLW Parmak Besinler',
    likes: 67,
    views: 450,
    isLiked: false,
    hasRecipe: false,
    isVerified: false,
    createdAt: hoursAgo(24),
    comments: [
      { id: 'c1', author: 'Mine K.', avatar: '👩', avatarBg: '#D8E8D0', time: '20 saat önce', text: 'BLW çok güzel bir yöntem! Biz de deniyoruz.', likes: 8, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '4', author: 'Zeynep Arslan', avatar: '👩‍🦰', avatarBg: '#F5E0D0', badge: null, category: 'recipe',
    time: '1 gün önce', babyAge: '7 aylık bebek',
    content: 'Elma-havuç püresi tarifi! Bebeğim bayıldı, ilk kaşıkta gülümsedi 😊🍎',
    photos: ['🍎🥕'], photoLabel: 'Elma-Havuç Püresi', likes: 35, views: 210, isLiked: false, hasRecipe: true, isVerified: false,
    createdAt: hoursAgo(28), comments: [
      { id: 'c1', author: 'Seda M.', avatar: '👩', avatarBg: '#D0E8D8', time: '26 saat önce', text: 'Tarifi paylaşır mısın?', likes: 3, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '5', author: 'Dr. Mehmet Yıldız', avatar: '👨‍⚕️', avatarBg: '#D0D8F0', badge: 'verified' as const, category: 'tip',
    time: '2 gün önce', babyAge: 'Pediatrist',
    content: 'Demir eksikliği ek gıda döneminde en sık karşılaşılan sorundur. Kırmızı et, mercimek ve C vitamini açısından zengin besinleri birlikte verin.',
    photos: [], likes: 156, views: 1120, isLiked: true, hasRecipe: false, isVerified: true,
    createdAt: hoursAgo(48), comments: [
      { id: 'c1', author: 'Ayşe Y.', avatar: '👩', avatarBg: '#E8D8C0', time: '1 gün önce', text: 'Hocam kaç aylıktan itibaren et verebiliriz?', likes: 14, isLiked: false, isVerified: false },
      { id: 'c1r1', author: 'Dr. Mehmet Yıldız', avatar: '👨‍⚕️', avatarBg: '#D0D8F0', time: '1 gün önce', text: '6. aydan itibaren pişmiş et püresi verilebilir.', likes: 22, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '6', author: 'Merve Demir', avatar: '👩', avatarBg: '#E0D8F0', badge: null, category: 'question',
    time: '2 gün önce', babyAge: '6 aylık bebek',
    content: 'Ek gıdaya yeni başladık, ilk hafta sadece tek besin mi vermeliyiz? Karışık yapabilir miyiz?',
    photos: [], likes: 23, views: 340, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(52), comments: [
      { id: 'c1', author: 'Dyt. Selin Ak', avatar: '👩‍⚕️', avatarBg: '#D8E0F0', time: '2 gün önce', text: 'İlk hafta tek tek deneyin, alerji takibi için önemli.', likes: 18, isLiked: false, isVerified: true },
    ],
  },
  {
    id: '7', author: 'Hande Yılmaz', avatar: '👩‍🦱', avatarBg: '#F0E0D0', badge: null, category: 'experience',
    time: '3 gün önce', babyAge: '9 aylık bebek',
    content: 'Yumurta alerjisi testinde hafif kızarıklık oldu. Doktora danıştık, 2 hafta ara verip tekrar deneyeceğiz.',
    photos: [], likes: 45, views: 520, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(72), comments: [
      { id: 'c1', author: 'Dr. Elif Demir', avatar: '👨‍⚕️', avatarBg: '#D0D8F0', time: '3 gün önce', text: 'Doğru yaklaşım. Az miktarla başlayıp gözlemlemek önemli.', likes: 31, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '8', author: 'Ceren Kaya', avatar: '👩', avatarBg: '#D8F0E0', badge: null, category: 'recipe',
    time: '3 gün önce', babyAge: '8 aylık bebek',
    content: 'Mercimek çorbası tarifi! Hem demir hem protein deposu, bebeğim çok seviyor 🍲',
    photos: ['🍲'], photoLabel: 'Bebek Mercimek Çorbası', likes: 89, views: 670, isLiked: true, hasRecipe: true, isVerified: false,
    createdAt: hoursAgo(78), comments: [
      { id: 'c1', author: 'Elif T.', avatar: '👩', avatarBg: '#E8D0D0', time: '2 gün önce', text: 'Tuz ekliyor musun?', likes: 5, isLiked: false, isVerified: false },
      { id: 'c2', author: 'Ceren Kaya', avatar: '👩', avatarBg: '#D8F0E0', time: '2 gün önce', text: 'Hayır, 1 yaşına kadar tuz eklemiyorum.', likes: 12, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '9', author: 'Büşra Aksoy', avatar: '👩‍🦰', avatarBg: '#F0D0E8', badge: null, category: 'tip',
    time: '4 gün önce', babyAge: '11 aylık bebek',
    content: 'Bebeğiniz yemek yemek istemiyorsa zorlamayın! Oyun arasında ikram edin, masada birlikte yiyin. Taklit ederek öğreniyorlar.',
    photos: [], likes: 72, views: 480, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(96), comments: [],
  },
  {
    id: '10', author: 'Ali Yılmaz', avatar: '👨', avatarBg: '#D0E0C8', badge: null, category: 'experience',
    time: '4 gün önce', babyAge: '7 aylık bebek',
    content: 'Baba olarak mutfağa girdim! İlk tarif: kabak püresi. Bebeğim yedi, ben de yedim 😄',
    photos: ['🎃'], photoLabel: 'Kabak Püresi', likes: 112, views: 830, isLiked: true, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(100), comments: [
      { id: 'c1', author: 'Zeynep A.', avatar: '👩‍🦰', avatarBg: '#F0D8E0', time: '4 gün önce', text: 'Süper baba! 💪', likes: 28, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '11', author: 'Dyt. Selin Ak', avatar: '👩‍⚕️', avatarBg: '#D8E0F0', badge: 'verified' as const, category: 'tip',
    time: '5 gün önce', babyAge: 'Diyetisyen',
    content: 'Su ihtiyacı: 6-12 ay arası bebekler günde 100-200 ml su içebilir. Yemek aralarında küçük yudumlarda verin.',
    photos: [], likes: 98, views: 720, isLiked: false, hasRecipe: false, isVerified: true,
    createdAt: hoursAgo(120), comments: [
      { id: 'c1', author: 'Merve D.', avatar: '👩', avatarBg: '#E0D8F0', time: '5 gün önce', text: 'Bardakla mı biberon ile mi vermeliyiz?', likes: 7, isLiked: false, isVerified: false },
      { id: 'c1r1', author: 'Dyt. Selin Ak', avatar: '👩‍⚕️', avatarBg: '#D8E0F0', time: '4 gün önce', text: 'Açık bardak veya pipetli bardak tercih edin.', likes: 15, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '12', author: 'Gamze Şahin', avatar: '👩', avatarBg: '#E0F0D8', badge: null, category: 'recipe',
    time: '5 gün önce', babyAge: '9 aylık bebek',
    content: 'Muzlu yulaf lapası! Sabah kahvaltısı için harika, hazırlaması 5 dakika 🍌',
    photos: ['🍌🥣'], photoLabel: 'Muzlu Yulaf Lapası', likes: 64, views: 390, isLiked: false, hasRecipe: true, isVerified: false,
    createdAt: hoursAgo(125), comments: [],
  },
  {
    id: '13', author: 'Sibel Türk', avatar: '👩‍🦱', avatarBg: '#F0E8D0', badge: null, category: 'question',
    time: '6 gün önce', babyAge: '6 aylık bebek',
    content: 'Avokado ilk deneme için uygun mu? Alerjik reaksiyon riski var mı?',
    photos: [], likes: 19, views: 280, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(144), comments: [
      { id: 'c1', author: 'Dr. Elif Demir', avatar: '👨‍⚕️', avatarBg: '#D0D8F0', time: '6 gün önce', text: 'Avokado düşük alerjik riskli bir besindir, ilk besinler arasında tercih edilebilir.', likes: 24, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '14', author: 'Pelin Koç', avatar: '👩', avatarBg: '#D8D0F0', badge: null, category: 'experience',
    time: '1 hafta önce', babyAge: '12 aylık bebek',
    content: '1 yaşını doldurduk! Artık sofrada bizimle aynı yemekleri yiyor (tuzsuz ve baharatsız versiyonlarını). Çok gurur duyuyorum 🎂',
    photos: ['🎂🍽'], photoLabel: '1 Yaş Kutlaması', likes: 203, views: 1450, isLiked: true, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(168), comments: [
      { id: 'c1', author: 'Büşra A.', avatar: '👩‍🦰', avatarBg: '#F0D0E8', time: '6 gün önce', text: 'Tebrikler! Bize de ilham oldu 🎉', likes: 15, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '15', author: 'Deniz Aydın', avatar: '👩', avatarBg: '#E8F0D0', badge: null, category: 'tip',
    time: '1 hafta önce', babyAge: '10 aylık bebek',
    content: 'Dondurma kalıplarına meyve püresi koyup dondurun. Diş çıkarma döneminde hem serinletici hem besleyici oluyor!',
    photos: [], likes: 87, views: 560, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(180), comments: [],
  },
  {
    id: '16', author: 'Esra Güneş', avatar: '👩‍🦱', avatarBg: '#F0D8D0', badge: null, category: 'recipe',
    time: '1 hafta önce', babyAge: '8 aylık bebek',
    content: 'Patates-bezelye püresi! Protein ve karbonhidrat dengesi mükemmel 🥔',
    photos: ['🥔🟢'], photoLabel: 'Patates-Bezelye Püresi', likes: 41, views: 310, isLiked: false, hasRecipe: true, isVerified: false,
    createdAt: hoursAgo(192), comments: [
      { id: 'c1', author: 'Gamze Ş.', avatar: '👩', avatarBg: '#E0F0D8', time: '1 hafta önce', text: 'Bezelye gaz yapıyor mu peki?', likes: 6, isLiked: false, isVerified: false },
      { id: 'c2', author: 'Esra Güneş', avatar: '👩‍🦱', avatarBg: '#F0D8D0', time: '1 hafta önce', text: 'Çok az miktarla başlayınca sorun olmadı bizde.', likes: 4, isLiked: false, isVerified: false },
    ],
  },
  {
    id: '17', author: 'Seda Yıldırım', avatar: '👩', avatarBg: '#D0F0E0', badge: null, category: 'question',
    time: '1 hafta önce', babyAge: '7 aylık bebek',
    content: 'Bebek bisküvisi vermeli miyiz? Hazır ürünler ne kadar güvenli?',
    photos: [], likes: 34, views: 420, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(200), comments: [
      { id: 'c1', author: 'Dyt. Selin Ak', avatar: '👩‍⚕️', avatarBg: '#D8E0F0', time: '1 hafta önce', text: 'Mümkünse ev yapımı tercih edin. Hazır ürünlerde şeker ve katkı maddesi kontrolü yapın.', likes: 28, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '18', author: 'Nur Özdemir', avatar: '👩‍🦰', avatarBg: '#F0E0D8', badge: null, category: 'experience',
    time: '2 hafta önce', babyAge: '8 aylık bebek',
    content: 'Ispanak denedik ama bebeğim yüzünü buruşturdu 😂 Elma ile karıştırınca yedi! Kombine tarifler gerçekten işe yarıyor.',
    photos: ['🥬🍎'], photoLabel: 'Ispanak-Elma Karışımı', likes: 56, views: 380, isLiked: false, hasRecipe: false, isVerified: false,
    createdAt: hoursAgo(336), comments: [],
  },
  {
    id: '19', author: 'Dr. Ayşe Kara', avatar: '👩‍⚕️', avatarBg: '#D0D8E8', badge: 'verified' as const, category: 'tip',
    time: '2 hafta önce', babyAge: 'Çocuk Doktoru',
    content: 'Bal 1 yaşından önce kesinlikle verilmemeli! Botulizm riski taşır. Pekmez ve tahin de dikkatli kullanılmalıdır.',
    photos: [], likes: 245, views: 1890, isLiked: true, hasRecipe: false, isVerified: true,
    createdAt: hoursAgo(340), comments: [
      { id: 'c1', author: 'Hande Y.', avatar: '👩‍🦱', avatarBg: '#F0E0D0', time: '2 hafta önce', text: 'Pekmez de mi yasak? Bilmiyordum!', likes: 11, isLiked: false, isVerified: false },
      { id: 'c1r1', author: 'Dr. Ayşe Kara', avatar: '👩‍⚕️', avatarBg: '#D0D8E8', time: '2 hafta önce', text: 'Pekmez yasak değil ama az miktarda ve kaliteli olanı tercih edin.', likes: 19, isLiked: true, isVerified: true },
    ],
  },
  {
    id: '20', author: 'Tuğçe Başar', avatar: '👩', avatarBg: '#E8D0E0', badge: null, category: 'recipe',
    time: '2 hafta önce', babyAge: '9 aylık bebek',
    content: 'Tavuk suyu çorbası! Hem bağışıklık güçlendirici hem besleyici. Kış aylarında vazgeçilmezimiz oldu 🍗',
    photos: ['🍗🥣'], photoLabel: 'Tavuk Suyu Çorbası', likes: 78, views: 540, isLiked: false, hasRecipe: true, isVerified: false,
    createdAt: hoursAgo(350), comments: [
      { id: 'c1', author: 'Ali Y.', avatar: '👨', avatarBg: '#D0E0C8', time: '2 hafta önce', text: 'Kaç günde tüketilmeli buzdolabında?', likes: 9, isLiked: false, isVerified: false },
      { id: 'c2', author: 'Tuğçe Başar', avatar: '👩', avatarBg: '#E8D0E0', time: '2 hafta önce', text: '2 gün içinde tüketin, gerisi buz kalıplarında dondurulabilir.', likes: 13, isLiked: false, isVerified: false },
    ],
  },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  blockedUserIds: [],
  hiddenPostIds: [],
  isLoaded: false,
  isLoadingMore: false,
  hasMore: true,
  lastPostDoc: null,

  loadFromStorage: async () => {
    try {
      const [data, blockedData, hiddenData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(BLOCKED_USERS_KEY),
        AsyncStorage.getItem('@kasik_hidden_posts'),
      ]);
      const blockedUserIds: string[] = blockedData ? JSON.parse(blockedData) : [];
      const hiddenPostIds: string[] = hiddenData ? JSON.parse(hiddenData) : [];
      if (data) {
        const parsed = JSON.parse(data).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
        set({ posts: parsed, blockedUserIds, hiddenPostIds, isLoaded: true });
      } else {
        set({ posts: DEFAULT_POSTS, blockedUserIds, hiddenPostIds, isLoaded: true });
        persistToStorage(DEFAULT_POSTS);
      }
    } catch (e) {
      console.error('Topluluk yüklenemedi:', e);
      set({ posts: DEFAULT_POSTS, isLoaded: true });
      persistToStorage(DEFAULT_POSTS);
    }
  },

  loadPosts: async () => {
    const userId = getAuthUserId();
    if (!userId) return;
    try {
      const PAGE_SIZE = 20;
      const { posts: remotePosts, lastDoc } = await firestoreGetPosts(undefined, PAGE_SIZE);
      if (remotePosts.length > 0) {
        const mapped: CommunityPost[] = remotePosts.map((p: any) => mapFirestorePost(p));
        set({ posts: mapped, lastPostDoc: lastDoc, hasMore: remotePosts.length === PAGE_SIZE });
        persistToStorage(mapped);

        // Subcollection'dan gerçek like durumlarını çek
        const likeStatuses = await getPostLikeStatuses(mapped.map((p) => p.id), userId);
        const withLikes = mapped.map((p) => ({ ...p, isLiked: likeStatuses[p.id] ?? false }));
        set({ posts: withLikes });
        persistToStorage(withLikes);
      }
    } catch (e) {
      console.warn('[CommunityStore] Firestore load failed, using local cache:', e);
    }
  },

  loadMorePosts: async () => {
    const { isLoadingMore, hasMore, lastPostDoc, posts } = get();
    if (isLoadingMore || !hasMore || !lastPostDoc) return;
    const userId = getAuthUserId();
    if (!userId) return;

    set({ isLoadingMore: true });
    try {
      const PAGE_SIZE = 20;
      const { posts: morePosts, lastDoc } = await firestoreGetPosts(undefined, PAGE_SIZE, lastPostDoc);
      if (morePosts.length > 0) {
        const mapped: CommunityPost[] = morePosts.map((p: any) => mapFirestorePost(p));
        const likeStatuses = await getPostLikeStatuses(mapped.map((p) => p.id), userId);
        const withLikes = mapped.map((p) => ({ ...p, isLiked: likeStatuses[p.id] ?? false }));
        const combined = [...posts, ...withLikes];
        set({ posts: combined, lastPostDoc: lastDoc, hasMore: morePosts.length === PAGE_SIZE, isLoadingMore: false });
        persistToStorage(combined);
      } else {
        set({ hasMore: false, isLoadingMore: false });
      }
    } catch (e) {
      console.warn('[CommunityStore] loadMorePosts failed:', e);
      set({ isLoadingMore: false });
    }
  },

  deletePost: (postId) => {
    // Kendi postunu tamamen sil (local + Firestore)
    const updated = get().posts.filter((p) => p.id !== postId);
    set({ posts: updated });
    persistToStorage(updated);
    deletePostFromFirestore(postId).catch(console.error);
  },

  hidePost: (postId) => {
    // Başkasının postunu sadece kendi ekranından gizle
    const { hiddenPostIds } = get();
    if (hiddenPostIds.includes(postId)) return;
    const updated = [...hiddenPostIds, postId];
    set({ hiddenPostIds: updated });
    debouncedSetItem('@kasik_hidden_posts', JSON.stringify(updated));
  },

  addPost: (post) => {
    const updated = [post, ...get().posts];
    set({ posts: updated });
    persistToStorage(updated);
    const userId = getAuthUserId();
    if (userId) {
      firestoreCreatePost({
        authorId: userId,
        authorName: post.author,
        avatar: post.avatar,
        avatarBg: post.avatarBg,
        category: post.category,
        babyAge: post.babyAge,
        content: post.content,
        photos: post.photos,
        photoLabel: post.photoLabel,
        likes: 0,
        views: 0,
        likedBy: [],
        hasRecipe: post.hasRecipe,
        recipeId: post.recipeId,
        isVerified: post.isVerified,
        commentCount: 0,
      } as any).catch((e) => console.warn('[CommunityStore] Post create failed:', e));
    }
  },

  togglePostLike: (postId) => {
    const post = get().posts.find((p) => p.id === postId);
    const updated = get().posts.map((p) =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    );
    set({ posts: updated });
    persistToStorage(updated);
    const userId = getAuthUserId();
    if (userId && post) {
      firestoreTogglePostLike(postId, userId, post.isLiked).catch((e) =>
        console.warn('[CommunityStore] Like toggle failed:', e)
      );
    }
  },

  addComment: (postId, comment) => {
    const updated = get().posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, comment] }
        : p
    );
    set({ posts: updated });
    persistToStorage(updated);
    const userId = getAuthUserId();
    if (userId) {
      firestoreAddComment(postId, {
        authorId: userId,
        authorName: comment.author,
        text: comment.text,
      } as any).catch((e) => console.warn('[CommunityStore] Comment add failed:', e));
    }
  },

  addReply: (postId, commentId, reply) => {
    const updated = get().posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        ),
      };
    });
    set({ posts: updated });
    persistToStorage(updated);
  },

  toggleCommentLike: (postId, commentId) => {
    const updated = get().posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                  : r
              ),
            };
          }
          return c;
        }),
      };
    });
    set({ posts: updated });
    persistToStorage(updated);
  },

  getPostById: (id) => {
    return get().posts.find((p) => p.id === id);
  },

  blockUser: (userId: string) => {
    const { blockedUserIds } = get();
    if (blockedUserIds.includes(userId)) return;
    const updated = [...blockedUserIds, userId];
    set({ blockedUserIds: updated });
    AsyncStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  unblockUser: (userId: string) => {
    const updated = get().blockedUserIds.filter((id) => id !== userId);
    set({ blockedUserIds: updated });
    AsyncStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  isUserBlocked: (userId: string) => {
    return get().blockedUserIds.includes(userId);
  },

  getFilteredPosts: () => {
    const { posts, blockedUserIds, hiddenPostIds } = get();
    return posts.filter((p) => {
      if (hiddenPostIds.includes(p.id)) return false;
      if (p.authorId && blockedUserIds.includes(p.authorId)) return false;
      return true;
    });
  },
}));
