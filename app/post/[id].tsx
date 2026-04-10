/**
 * Kasik — Post Detail Screen (Gonderi Detay)
 * Full post view with all comments, like/reply, photo gallery
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
  Typography,
} from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AdBanner } from '../../components/ui/AdBanner';
import { useCommunityStore, CommunityComment } from '../../stores/communityStore';
import { checkContent } from '../../lib/contentModeration';
import { useAuthStore } from '../../stores/authStore';
import { reportPost } from '../../lib/firestore';

// ===== COMPONENT =====

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPostById, togglePostLike, addComment, addReply, toggleCommentLike: storeToggleCommentLike, blockUser, hidePost } = useCommunityStore();
  const post = getPostById(id || '1');

  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const heartScale = useRef(new Animated.Value(1)).current;

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 56 }}>🥄</Text>
          <Text style={styles.emptyTitle}>Gönderi bulunamadı</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleLike = () => {
    togglePostLike(post!.id);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const toggleCommentLike = (commentId: string) => {
    storeToggleCommentLike(post!.id, commentId);
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    // İçerik moderasyonu
    const moderationResult = checkContent(newComment.trim());
    if (moderationResult) {
      Alert.alert('İçerik Uyarısı', moderationResult);
      return;
    }

    const currentUser = useAuthStore.getState().user;
    const comment: CommunityComment = {
      id: `new_${Date.now()}`,
      authorId: currentUser?.uid,
      author: currentUser?.displayName || 'Ben',
      avatar: '👤',
      avatarBg: Colors.creamMid,
      time: 'Şimdi',
      text: newComment.trim(),
      likes: 0,
      isLiked: false,
      isVerified: false,
    };

    if (replyingTo) {
      addReply(post!.id, replyingTo.commentId, comment);
      setReplyingTo(null);
    } else {
      addComment(post!.id, comment);
    }
    setNewComment('');

    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo({ commentId, authorName });
    inputRef.current?.focus();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.author}: "${post.content.slice(0, 100)}..."\n\nKaşık - Ek Gıda Rehberi`,
      });
    } catch (e) { console.error('Post paylaşma hatası:', e); }
  };

  const handleReport = () => {
    Alert.alert(
      'Gönderiyi Şikayet Et',
      'Bu gönderi uygunsuz içerik mi barındırıyor? Şikayet edilen gönderi incelenmek üzere kaldırılacaktır.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Şikayet Et',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = useAuthStore.getState().user;
              if (currentUser?.uid && post?.authorId) {
                await reportPost(post.id, currentUser.uid, post.authorId, 'Uygunsuz içerik');
              }
            } catch (e) {
              console.error('Şikayet kayıt hatası:', e);
            }
            if (post) hidePost(post.id);
            Alert.alert('Şikayet Edildi', 'Gönderi şikayet edildi ve kaldırıldı. Teşekkürler.', [
              { text: 'Tamam', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const handleBlockUser = () => {
    if (!post?.authorId) return;
    Alert.alert(
      'Kullanıcıyı Engelle',
      `${post.author} adlı kullanıcıyı engellemek istiyor musunuz? Bu kullanıcının tüm gönderilerini artık görmeyeceksiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: () => {
            blockUser(post.authorId!);
            Alert.alert('Engellendi', `${post.author} engellendi. Tüm gönderileri artık görünmeyecek.`, [
              { text: 'Tamam', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const handlePostMenu = () => {
    const options: { text: string; style?: 'destructive' | 'cancel' | 'default'; onPress?: () => void }[] = [
      {
        text: 'Şikayet Et',
        style: 'destructive',
        onPress: handleReport,
      },
    ];

    if (post?.authorId) {
      options.push({
        text: 'Kullanıcıyı Engelle',
        style: 'destructive',
        onPress: handleBlockUser,
      });
    }

    options.push({ text: 'İptal', style: 'cancel' });
    Alert.alert('Gönderi Seçenekleri', '', options);
  };

  const handleCommentMenu = (comment: CommunityComment) => {
    const currentUser = useAuthStore.getState().user;
    const isOwnComment = currentUser?.uid && comment.authorId === currentUser.uid;
    if (isOwnComment) return; // Kendi yorumuna menü gösterme

    const options: { text: string; style?: 'destructive' | 'cancel' | 'default'; onPress?: () => void }[] = [
      {
        text: 'Yorumu Şikayet Et',
        style: 'destructive',
        onPress: async () => {
          try {
            if (currentUser?.uid && comment.authorId) {
              await reportPost(comment.id, currentUser.uid, comment.authorId, 'Uygunsuz yorum');
            }
          } catch (e) {
            console.error('Yorum şikayet hatası:', e);
          }
          Alert.alert('Şikayet Edildi', 'Yorum şikayet edildi. Teşekkürler.');
        },
      },
    ];

    if (comment.authorId) {
      options.push({
        text: 'Kullanıcıyı Engelle',
        style: 'destructive',
        onPress: () => {
          blockUser(comment.authorId!);
          Alert.alert('Engellendi', `${comment.author} engellendi. Tüm gönderileri artık görünmeyecek.`);
        },
      });
    }

    options.push({ text: 'İptal', style: 'cancel' });
    Alert.alert('Yorum Seçenekleri', '', options);
  };

  const renderComment = (comment: CommunityComment, isReply = false) => (
    <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
      <View style={[styles.commentAvatar, { backgroundColor: comment.avatarBg }]}>
        <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
      </View>
      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <View style={styles.commentNameRow}>
            <Text style={styles.commentAuthor}>{comment.author}</Text>
            {comment.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.commentTime}>{comment.time}</Text>
            {comment.authorId && comment.authorId !== useAuthStore.getState().user?.uid && (
              <TouchableOpacity onPress={() => handleCommentMenu(comment)}>
                <Text style={{ fontSize: 16, color: '#999' }}>•••</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.commentText}>{comment.text}</Text>

        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => toggleCommentLike(comment.id)}
          >
            <Text style={{ fontSize: 12 }}>{comment.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.commentActionText}>{comment.likes}</Text>
          </TouchableOpacity>
          {!isReply && (
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => handleReply(comment.id, comment.author)}
            >
              <Text style={styles.commentActionText}>Yanıtla</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gönderi</Text>
          <TouchableOpacity onPress={handlePostMenu} style={styles.headerIconBtn}>
            <Text style={styles.headerIcon}>···</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post Content */}
          <Card padding="xl" style={styles.postCard}>
            {/* Author */}
            <View style={styles.authorRow}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => {
                  if (post.authorId) {
                    router.push(`/user/${post.authorId}?name=${encodeURIComponent(post.author)}&avatar=${encodeURIComponent(post.avatar)}&avatarBg=${encodeURIComponent(post.avatarBg)}`);
                  }
                }}
                disabled={!post.authorId}
              >
                <View style={[styles.avatar, { backgroundColor: post.avatarBg }]}>
                  <Text style={styles.avatarText}>{post.avatar}</Text>
                </View>
                <View style={styles.authorInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    {post.badge === 'verified' && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.authorMeta}>
                    {post.time} · {post.babyAge}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Photo */}
            {post.photos.length > 0 && (
              <View style={styles.photoContainer}>
                <Text style={styles.photoEmoji}>{post.photos[0]}</Text>
                {post.photoLabel && (
                  <Text style={styles.photoLabel}>{post.photoLabel}</Text>
                )}
                {post.hasRecipe && (
                  <TouchableOpacity style={styles.recipeTag}>
                    <Text style={styles.recipeTagText}>🍽 Tarifi Gor</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Article */}
            {post.hasArticle && (
              <TouchableOpacity style={styles.articleCard}>
                <Text style={styles.articleMascot}>🥄</Text>
                <View style={styles.articleInfo}>
                  <Text style={styles.articleTitle}>{post.articleTitle}</Text>
                  <Text style={styles.articleSubtitle}>{post.articleSubtitle}</Text>
                  <View style={styles.articleTags}>
                    <Badge label="Makale" variant="warning" />
                    <Badge label="5 dk okuma" variant="success" />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Engagement Bar */}
            <View style={styles.engagementRow}>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <TouchableOpacity onPress={toggleLike} style={styles.engageBtn}>
                  <Text style={{ fontSize: 18 }}>{post.isLiked ? '❤️' : '🤍'}</Text>
                  <Text style={styles.engageCount}>{post.likes}</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.engageBtn}>
                <Text style={{ fontSize: 18 }}>💬</Text>
                <Text style={styles.engageCount}>{post.comments.length}</Text>
              </View>

              <TouchableOpacity onPress={handleShare} style={styles.engageBtn}>
                <Text style={{ fontSize: 18 }}>↗️</Text>
                <Text style={styles.engageCount}>Paylas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bookmarkBtn}
                onPress={() => setIsBookmarked(!isBookmarked)}
              >
                <Text style={{ fontSize: 18 }}>{isBookmarked ? '🔖' : '📑'}</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Ad */}
          <AdBanner showUpgrade={false} />

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              💬 Yorumlar ({post.comments.length})
            </Text>

            {post.comments.length === 0 ? (
              <View style={styles.noComments}>
                <Text style={{ fontSize: 32 }}>🥄</Text>
                <Text style={styles.noCommentsText}>
                  Henüz yorum yok. İlk yorumu siz yapın!
                </Text>
              </View>
            ) : (
              <View style={styles.commentsList}>
                {post.comments.map((comment) => renderComment(comment))}
              </View>
            )}
          </View>

          {/* Bottom padding for input */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          {replyingTo && (
            <View style={styles.replyIndicator}>
              <Text style={styles.replyIndicatorText}>
                @{replyingTo.authorName} yanıtlanıyor
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={styles.replyIndicatorCancel}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={replyingTo ? `@${replyingTo.authorName} yanıtla...` : 'Yorum yazın...'}
              placeholderTextColor={Colors.border}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !newComment.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleSendComment}
              disabled={!newComment.trim()}
            >
              <Text style={styles.sendBtnText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ===== STYLES =====

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamDark,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: { fontSize: 18, fontFamily: FontFamily.bold, color: Colors.textDark },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.textDark },

  // Scroll
  scrollContent: { padding: Spacing.xl, gap: Spacing.lg },

  // Empty
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textDark },
  backBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.sage,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.white },

  // Post Card
  postCard: { gap: Spacing.md },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 24 },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  authorName: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textDark },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: { fontFamily: FontFamily.bold, fontSize: 9, color: Colors.white },
  authorMeta: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textLight },

  postContent: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
    lineHeight: 24,
  },

  // Photo
  photoContainer: {
    backgroundColor: Colors.creamMid,
    borderRadius: BorderRadius.lg,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoEmoji: { fontSize: 56 },
  photoLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  recipeTag: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    ...Shadow.soft,
  },
  recipeTagText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.sage },

  // Article
  articleCard: {
    backgroundColor: Colors.creamMid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  articleMascot: { fontSize: 32 },
  articleInfo: { flex: 1, gap: 4 },
  articleTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textDark },
  articleSubtitle: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textLight },
  articleTags: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },

  // Engagement
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.creamMid,
  },
  engageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  engageCount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textMid },
  bookmarkBtn: { marginLeft: 'auto' },

  // Comments Section
  commentsSection: { gap: Spacing.md },
  commentsTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textDark,
  },
  noComments: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  noCommentsText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
  },
  commentsList: { gap: Spacing.lg },

  // Comment Item
  commentItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  replyItem: {
    marginLeft: Spacing.xl,
    marginTop: Spacing.md,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  commentAvatarText: { fontSize: 16 },
  commentBody: { flex: 1, gap: 4 },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentAuthor: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textDark },
  commentTime: { fontFamily: FontFamily.medium, fontSize: 10, color: Colors.textLight },
  commentText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: 4,
  },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.textLight },
  repliesContainer: { marginTop: 4 },

  // Reply indicator
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.sagePale,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  replyIndicatorText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.sage,
  },
  replyIndicatorCancel: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.textLight,
    padding: 4,
  },

  // Comment Input
  inputContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.creamDark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
    maxHeight: 80,
    paddingVertical: Spacing.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.creamDark,
  },
  sendBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
});
