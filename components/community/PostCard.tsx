/**
 * Kaşık — PostCard Component
 * Memoized community post card for FlatList performance.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ThemeColors } from '../../constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AdBanner } from '../ui/AdBanner';
import { CommunityPost } from '../../stores/communityStore';
import { reportPost } from '../../lib/firestore';
import { useAuthStore } from '../../stores/authStore';

export interface PostCardProps {
  post: CommunityPost;
  index: number;
  colors: ThemeColors;
  styles: ReturnType<typeof StyleSheet.create>;
  onToggleLike: (id: string) => void;
  onDeletePost?: (id: string) => void;
  onBlockUser?: (userId: string) => void;
  isRecipeSaved: (id: string) => boolean;
  onSaveRecipe: (recipeId: string, category?: 'favorites' | 'try_later' | 'made_it') => void;
}

const PostCard = React.memo(function PostCard({
  post,
  index,
  colors,
  styles,
  onToggleLike,
  onDeletePost,
  onBlockUser,
  isRecipeSaved,
  onSaveRecipe,
}: PostCardProps) {
  const handleReport = () => {
    Alert.alert(
      'Gönderiyi Şikayet Et',
      'Bu gönderiyi şikayet etmek istiyor musunuz? Kullanıcı otomatik olarak engellenecektir.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Şikayet Et ve Engelle',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = useAuthStore.getState().user;
              if (currentUser?.uid && post.authorId) {
                await reportPost(post.id, currentUser.uid, post.authorId, 'Uygunsuz içerik');
              }
            } catch (e) {
              console.error('Şikayet kayıt hatası:', e);
            }
            // Şikayet sonrası otomatik engelle
            if (post.authorId) {
              onBlockUser?.(post.authorId);
            }
            Alert.alert('Şikayet Edildi', 'Gönderi şikayet edildi ve kullanıcı engellendi. Teşekkürler.');
          },
        },
      ],
    );
  };

  const handleBlockUser = () => {
    if (!post.authorId) return;
    Alert.alert(
      'Kullanıcıyı Engelle',
      `${post.author} adlı kullanıcıyı engellemek istiyor musunuz? Bu kullanıcının gönderilerini artık görmeyeceksiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: () => {
            onBlockUser?.(post.authorId!);
            Alert.alert('Engellendi', `${post.author} engellendi. Gönderileri artık görünmeyecek.`);
          },
        },
      ],
    );
  };

  const handleMorePress = () => {
    const currentUser = useAuthStore.getState().user;
    const isOwnPost = currentUser?.uid && post.authorId === currentUser.uid;
    const options: { text: string; style?: 'destructive' | 'cancel' | 'default'; onPress?: () => void }[] = [];

    // Kendi gönderisini silebilir (sadece kendi ekranından gizler)
    if (isOwnPost && onDeletePost) {
      options.push({
        text: 'Gönderiyi Sil',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Sil', 'Bu gönderiyi silmek istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => onDeletePost(post.id) },
          ]);
        },
      });
    }

    // Başkasının gönderisi — şikayet et ve engelle
    if (!isOwnPost) {
      options.push({
        text: 'Şikayet Et',
        style: 'destructive',
        onPress: handleReport,
      });
      if (post.authorId) {
        options.push({
          text: 'Kullanıcıyı Engelle',
          style: 'destructive',
          onPress: handleBlockUser,
        });
      }
    }

    options.push({ text: 'İptal', style: 'cancel' });

    Alert.alert('Gönderi Seçenekleri', '', options);
  };
  return (
    <React.Fragment>
      <Card padding="lg" style={styles.postCard} onPress={() => router.push(`/post/${post.id}`)}>
        {/* Author row */}
        <View style={styles.authorRow}>
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
              {post.category === 'recipe' ? '🍽 Tarif' : post.category === 'question' ? '❓ Soru' : post.category === 'experience' ? '⭐ Deneyim' : '💡 İpucu'}
              {' · '}{post.time}{post.babyAge ? ` · ${post.babyAge}` : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={handleMorePress}>
            <Text style={styles.moreIcon}>···</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Photo */}
        {post.photos.length > 0 && (
          <View style={styles.photoContainer}>
            {post.photos[0].length > 5 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                {post.photos.map((uri, pIdx) => (
                  <Image
                    key={pIdx}
                    source={{ uri }}
                    style={[
                      styles.postImage as any,
                      post.photos.length === 1 && (styles.postImageSingle as any),
                    ]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <>
                <Text style={styles.photoEmoji}>{post.photos[0]}</Text>
                {post.photoLabel && (
                  <Text style={styles.photoLabel}>{post.photoLabel}</Text>
                )}
              </>
            )}
            {post.hasRecipe && post.recipeId && (
              <View style={styles.recipeTagRow}>
                <TouchableOpacity
                  style={styles.recipeTag}
                  onPress={() => router.push(`/recipe/${post.recipeId}` as any)}
                >
                  <Text style={styles.recipeTagText}>🍽 Tarifi Gör</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.recipeTag,
                    isRecipeSaved(post.recipeId) && styles.recipeTagSaved,
                  ]}
                  onPress={() => {
                    if (!isRecipeSaved(post.recipeId!)) {
                      onSaveRecipe(post.recipeId!, 'favorites');
                    }
                  }}
                >
                  <Text style={styles.recipeTagText}>
                    {isRecipeSaved(post.recipeId) ? '✅ Kaydedildi' : '📖 Deftere Ekle'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Article card */}
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

        {/* Engagement bar */}
        <View style={styles.engagementRow}>
          <TouchableOpacity
            onPress={() => onToggleLike(post.id)}
            style={styles.engageBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={post.isLiked ? 'Beğeniyi kaldır' : 'Beğen'}
            accessibilityState={{ selected: post.isLiked }}
          >
            <Text>{post.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.engageCount}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.engageBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`${post.comments.length} yorum`}
          >
            <Text>💬</Text>
            <Text style={styles.engageCount}>{post.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.engageBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Paylaş"
          >
            <Text>↗️</Text>
            <Text style={styles.engageCount}>Paylaş</Text>
          </TouchableOpacity>
          {post.recipeId && (
            <TouchableOpacity
              style={styles.bookmarkBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => {
                if (!isRecipeSaved(post.recipeId!)) {
                  onSaveRecipe(post.recipeId!, 'favorites');
                }
              }}
            >
              <Text>{isRecipeSaved(post.recipeId) ? '🔖' : '📑'}</Text>
            </TouchableOpacity>
          )}
          {!post.recipeId && (
            <TouchableOpacity
              style={styles.bookmarkBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text>🔖</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Top comment preview */}
        {post.topComment && (
          <View style={styles.commentPreview}>
            <View style={styles.commentAvatar}>
              <Text style={{ fontSize: 10 }}>{post.topComment.avatar}</Text>
            </View>
            <View>
              <Text style={styles.commentAuthor}>{post.topComment.author}</Text>
              <Text style={styles.commentText}>{post.topComment.text}</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Show ad after every 3rd post */}
      {(index + 1) % 3 === 0 && <AdBanner showUpgrade={false} />}
    </React.Fragment>
  );
});

export default PostCard;
