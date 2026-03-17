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
  isLoaded: boolean;

  loadFromStorage: () => Promise<void>;
  loadPosts: () => Promise<void>;
  addPost: (post: CommunityPost) => void;
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, comment: CommunityComment) => void;
  addReply: (postId: string, commentId: string, reply: CommunityComment) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  getPostById: (id: string) => CommunityPost | undefined;
}

const STORAGE_KEY = '@kasik_community';

const persistToStorage = (posts: CommunityPost[]) => {
  try {
    debouncedSetItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Topluluk kaydedilemedi:', e);
  }
};

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
      {
        id: 'c1',
        author: 'Mine K.',
        avatar: '👩',
        avatarBg: '#D8E8D0',
        time: '20 saat önce',
        text: 'BLW çok güzel bir yöntem! Biz de deniyoruz.',
        likes: 8,
        isLiked: false,
        isVerified: false,
      },
    ],
  },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
        set({ posts: parsed, isLoaded: true });
      } else {
        set({ posts: DEFAULT_POSTS, isLoaded: true });
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
      const remotePosts = await firestoreGetPosts(undefined, 50);
      if (remotePosts.length > 0) {
        // Firestore Post → CommunityPost mapping
        const mapped: CommunityPost[] = remotePosts.map((p: any) => ({
          id: p.id,
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
          comments: [], // Comments loaded separately
          isLiked: (p.likedBy || []).includes(userId),
          hasRecipe: p.hasRecipe || false,
          recipeId: p.recipeId,
          isVerified: p.isVerified || false,
          createdAt: p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt),
        }));
        set({ posts: mapped });
        persistToStorage(mapped);
      }
    } catch (e) {
      console.warn('[CommunityStore] Firestore load failed, using local cache:', e);
    }
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
}));
