import { supabase } from './supabase';

const BUCKET_NAME = 'tool-images';

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param fileName - Optional custom file name (will generate one if not provided)
 * @returns The public URL of the uploaded image or null if failed
 */
export async function uploadImage(file: File, fileName?: string): Promise<string | null> {
  try {
    // Generate a unique filename if not provided
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}-${randomStr}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 * @returns true if successful, false otherwise
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);
    if (pathParts.length < 2) return false;

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Get the public URL for an image stored in Supabase Storage
 * @param filePath - The path of the file in storage
 * @returns The public URL
 */
export function getImageUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

/**
 * Download an image from a URL and upload it to Supabase Storage
 * @param imageUrl - The URL of the image to download and upload
 * @returns The public URL of the uploaded image or null if failed
 */
export async function downloadAndUploadImage(imageUrl: string): Promise<string | null> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to fetch image from URL:', response.statusText);
      return null;
    }

    // Get the blob
    const blob = await response.blob();
    
    // Convert blob to File
    const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'png';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = `downloaded-${timestamp}-${randomStr}.${fileExt}`;
    
    const file = new File([blob], fileName, { type: blob.type });

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      console.error('Downloaded image validation failed:', validation.error);
      return null;
    }

    // Upload to Supabase Storage
    return await uploadImage(file, fileName);
  } catch (error) {
    console.error('Error in downloadAndUploadImage:', error);
    return null;
  }
}

/**
 * Validate if a file is an image and within size limits
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns true if valid, error message if invalid
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, GIF, WebP, or SVG image.',
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    };
  }

  return { valid: true };
}
