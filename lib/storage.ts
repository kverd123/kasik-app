/**
 * Kaşık — Firebase Storage Service
 * Photo upload for recipes and community posts
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compress and resize image before upload
 */
const compressImage = async (uri: string): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

/**
 * Convert a local file URI to a Blob (React Native compatible)
 */
const uriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response as Blob);
    xhr.onerror = () => reject(new Error('Failed to convert URI to blob'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

/**
 * Upload a photo to Firebase Storage
 */
export const uploadPhoto = async (
  uri: string,
  path: string // e.g., 'recipes/{recipeId}/photo_1.jpg'
): Promise<string> => {
  // Compress the image first
  const compressedUri = await compressImage(uri);

  // Convert URI to blob (use XMLHttpRequest for React Native compatibility)
  const blob = await uriToBlob(compressedUri);

  // Upload to Firebase Storage
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);

  // Return the download URL
  return await getDownloadURL(storageRef);
};

/**
 * Upload recipe photo(s)
 */
export const uploadRecipePhotos = async (
  recipeId: string,
  photoUris: string[]
): Promise<string[]> => {
  const uploadPromises = photoUris.map((uri, index) =>
    uploadPhoto(uri, `recipes/${recipeId}/photo_${index}.jpg`)
  );
  return await Promise.all(uploadPromises);
};

/**
 * Upload community post photo(s)
 */
export const uploadPostPhotos = async (
  postId: string,
  photoUris: string[]
): Promise<string[]> => {
  const uploadPromises = photoUris.map((uri, index) =>
    uploadPhoto(uri, `posts/${postId}/photo_${index}.jpg`)
  );
  return await Promise.all(uploadPromises);
};

/**
 * Upload user profile photo
 */
export const uploadProfilePhoto = async (
  userId: string,
  uri: string
): Promise<string> => {
  return await uploadPhoto(uri, `profiles/${userId}/avatar.jpg`);
};

/**
 * Upload baby profile photo
 */
export const uploadBabyPhoto = async (
  userId: string,
  babyId: string,
  uri: string
): Promise<string> => {
  return await uploadPhoto(uri, `profiles/${userId}/babies/${babyId}.jpg`);
};
