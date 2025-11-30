import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebase.config";
import type { UserProfile } from "@/types/firebase.types";

/**
 * Register new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    // Create Firebase Auth user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return user;
  } catch (error: any) {
    console.error("Register error:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error("Đăng xuất thất bại. Vui lòng thử lại.");
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
};

/**
 * Convert Firebase Auth error codes to Vietnamese messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Email này đã được sử dụng";
    case "auth/invalid-email":
      return "Email không hợp lệ";
    case "auth/operation-not-allowed":
      return "Tính năng này chưa được kích hoạt";
    case "auth/weak-password":
      return "Mật khẩu quá yếu (tối thiểu 6 ký tự)";
    case "auth/user-disabled":
      return "Tài khoản đã bị vô hiệu hóa";
    case "auth/user-not-found":
      return "Không tìm thấy tài khoản";
    case "auth/wrong-password":
      return "Mật khẩu không đúng";
    case "auth/invalid-credential":
      return "Email hoặc mật khẩu không đúng";
    case "auth/too-many-requests":
      return "Quá nhiều lần thử. Vui lòng thử lại sau";
    case "auth/network-request-failed":
      return "Lỗi kết nối mạng. Vui lòng kiểm tra internet";
    default:
      return "Đã xảy ra lỗi. Vui lòng thử lại";
  }
};
