/**
 * Kaşık — Kullanıcı Profil Sayfası
 * Bir kullanıcının tüm gönderilerini görüntüle + engelle
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { useCommunityStore } from '../../stores/communityStore';
import { useAuthStore } from '../../stores/authStore';

export default function UserProfileScreen() {
  const { id, name, avatar, avatarBg } = useLocalSearchParams<{
    id: string;
    name: string;
    avatar: string;
    avatarBg: string;
  }>();

  const { posts, blockUser, isUserBlocked } = useCommunityStore();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.uid === id;
  const blocked = isUserBlocked(id || '');

  const userPosts = useMemo(() => {
    return posts.filter((p) => p.authorId === id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [posts, id]);

  const handleBlock = () => {
    if (!id) return;
    Alert.alert(
      'Kullanıcıyı Engelle',
      `${name || 'Bu kullanıcı'} adlı kullanıcıyı engellemek istiyor musunuz? Tüm gönderilerini artık görmeyeceksiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: () => {
            blockUser(id);
            Alert.alert('Engellendi', `${name || 'Kullanıcı'} engellendi.`, [
              { text: 'Tamam', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const renderPost = ({ item }: { item: typeof userPosts[0] }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => router.push(`/post/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <Text style={styles.postCategory}>
          {item.category === 'recipe' ? '🍽 Tarif' : item.category === 'question' ? '❓ Soru' : item.category === 'experience' ? '⭐ Deneyim' : '💡 İpucu'}
        </Text>
        <Text style={styles.postTime}>{item.time}</Text>
      </View>
      <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
      {item.photos.length > 0 && (
        <Text style={styles.photoIndicator}>📷 {item.photos.length} fotoğraf</Text>
      )}
      <View style={styles.postStats}>
        <Text style={styles.statText}>❤️ {item.likes}</Text>
        <Text style={styles.statText}>💬 {item.comments.length}</Text>
        <Text style={styles.statText}>👁 {item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Geri</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: avatarBg || Colors.creamMid }]}>
          <Text style={styles.avatarText}>{avatar || '👤'}</Text>
        </View>
        <Text style={styles.userName}>{name || 'Kullanıcı'}</Text>
        <Text style={styles.postCount}>{userPosts.length} gönderi</Text>

        {!isOwnProfile && !blocked && (
          <TouchableOpacity style={styles.blockBtn} onPress={handleBlock}>
            <Text style={styles.blockBtnText}>🚫 Kullanıcıyı Engelle</Text>
          </TouchableOpacity>
        )}
        {blocked && (
          <View style={styles.blockedBadge}>
            <Text style={styles.blockedText}>Bu kullanıcı engellendi</Text>
          </View>
        )}
      </View>

      {/* Posts */}
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Henüz gönderi yok</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamMid,
  },
  backBtn: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.sage,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamMid,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.espresso,
    marginTop: Spacing.sm,
  },
  postCount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.espressoLight,
    marginTop: 4,
  },
  blockBtn: {
    marginTop: Spacing.md,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  blockBtnText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#D32F2F',
  },
  blockedBadge: {
    marginTop: Spacing.md,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  blockedText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#999',
  },
  listContent: {
    padding: Spacing.md,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  postCategory: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.sage,
  },
  postTime: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.espressoLight,
  },
  postContent: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.espresso,
    lineHeight: 20,
  },
  photoIndicator: {
    fontSize: FontSize.xs,
    color: Colors.espressoLight,
    marginTop: 6,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.espressoLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.espressoLight,
  },
});
