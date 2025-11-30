import * as FileSystem from "expo-file-system/legacy";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

/**
 * Convert ảnh từ ImagePicker URI → Base64 với data URI prefix
 *
 * Flow:
 * 1. Resize ảnh về maxWidth (giảm kích thước)
 * 2. Compress quality (giảm dung lượng)
 * 3. Đọc file thành base64
 * 4. Thêm prefix "data:image/jpeg;base64,"
 *
 * @param uri - Local file URI (file:///path/to/image.jpg)
 * @param maxWidth - Resize về width tối đa (default: 1024px)
 * @param quality - JPEG quality 0-1 (default: 0.8 = 80%)
 * @returns Base64 string với prefix (ready cho API)
 *
 * Example:
 * ```ts
 * const imageUri = result.assets[0].uri;
 * const base64 = await convertImageToBase64(imageUri);
 * // → "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
 * ```
 */
export const convertImageToBase64 = async (
  uri: string,
  maxWidth: number = 1024,
  quality: number = 0.8
): Promise<string> => {
  try {
    console.log("📸 [Convert] Starting...", { uri, maxWidth, quality });

    // Bước 1: Resize và compress ảnh
    const manipulated = await manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }], // Resize về 1024px width (giữ tỷ lệ)
      {
        compress: quality, // Quality 0.8 = 80%
        format: SaveFormat.JPEG, // Luôn output JPEG
      }
    );

    console.log("✅ [Convert] Resized to:", manipulated.uri);

    // Bước 2: Đọc file thành base64
    const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
      encoding: "base64",
    });

    console.log("✅ [Convert] Base64 length:", base64.length);

    // Bước 3: Thêm data URI prefix (backend yêu cầu)
    const dataUri = `data:image/jpeg;base64,${base64}`;

    console.log("✅ [Convert] Complete! Total length:", dataUri.length);

    return dataUri;
  } catch (error) {
    console.error("❌ [Convert] Error:", error);
    throw new Error("Không thể xử lý ảnh. Vui lòng thử lại.");
  }
};

/**
 * Lấy kích thước file ảnh (KB)
 * Dùng để validate hoặc hiển thị info
 */
export const getImageSize = async (uri: string): Promise<number> => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && "size" in info) {
      return info.size / 1024; // Bytes → KB
    }
    return 0;
  } catch (error) {
    console.error("❌ [Size] Error:", error);
    return 0;
  }
};

/**
 * Validate ảnh trước khi upload
 * Kiểm tra: File có tồn tại? Có quá lớn không?
 */
export const validateImage = async (
  uri: string,
  maxSizeMB: number = 10
): Promise<{ valid: boolean; error?: string }> => {
  try {
    const info = await FileSystem.getInfoAsync(uri);

    // Check exists
    if (!info.exists) {
      return { valid: false, error: "File không tồn tại" };
    }

    // Check size
    if ("size" in info) {
      const sizeMB = info.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return {
          valid: false,
          error: `Ảnh quá lớn (${sizeMB.toFixed(2)}MB). Tối đa ${maxSizeMB}MB`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("❌ [Validate] Error:", error);
    return { valid: false, error: "Không thể kiểm tra ảnh" };
  }
};
