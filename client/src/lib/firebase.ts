import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  type User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer, 
  setDoc, 
  addDoc,
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
auth.languageCode = "ar";

export const googleProvider = new GoogleAuthProvider();

// Error handling types and helper as required by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL CONSTRAINT: Test connection to Firestore on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("[FIREBASE] Connection to Firestore established successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration: client is offline.");
    } else {
      // Diagnostic check only; do not throw to avoid halting initial load
      console.log("[FIREBASE] Connection check completed.");
    }
  }
}
testFirestoreConnection();

export interface UserProfileData {
  uid: string;
  username: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role?: "user" | "guide" | "hotel_manager" | "admin";
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Creates or updates a user profile document in Firestore (/users/{userId})
 */
export async function syncUserProfile(user: FirebaseUser, additionalData: Partial<UserProfileData> = {}) {
  const userRef = doc(db, "users", user.uid);
  const path = `users/${user.uid}`;
  try {
    const existingSnap = await getDoc(userRef);
    const nowIso = new Date().toISOString();
    
    if (!existingSnap.exists()) {
      const derivedUsername = additionalData.username || 
        user.displayName?.replace(/\s+/g, "_").toLowerCase() || 
        user.email?.split("@")[0] || 
        `user_${user.uid.slice(0, 6)}`;

      const newProfile: UserProfileData = {
        uid: user.uid,
        username: derivedUsername,
        email: user.email || additionalData.email || "",
        displayName: user.displayName || additionalData.displayName || derivedUsername,
        photoURL: user.photoURL || additionalData.photoURL || "",
        role: additionalData.role || (user.email === "admabthalat@gmail.com" ? "admin" : "user"),
        phone: user.phoneNumber || additionalData.phone || "",
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const data = existingSnap.data() as UserProfileData;
      return data;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Sign in or Register using Google Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(result.user);
    if (profile?.username) {
      localStorage.setItem("shouma-username", profile.username);
    }
    return { user: result.user, profile };
  } catch (err: any) {
    console.error("[FIREBASE GOOGLE SIGNIN ERROR]:", err);
    throw new Error(err.message || "فشل تسجيل الدخول عبر Google");
  }
}

/**
 * Sign in using Email and Password
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    // If username is provided without @, map to shouma domain or keep as provided
    const normalizedEmail = email.includes("@") ? email.trim() : `${email.trim().toLowerCase()}@shouma.om`;
    const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const profile = await syncUserProfile(result.user, {
      username: email.includes("@") ? email.split("@")[0] : email.trim(),
    });
    if (profile?.username) {
      localStorage.setItem("shouma-username", profile.username);
    }
    return { user: result.user, profile };
  } catch (err: any) {
    console.error("[FIREBASE EMAIL LOGIN ERROR]:", err);
    if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
      throw new Error("بيانات الدخول غير صحيحة، يرجى التأكد من البريد أو اسم المستخدم وكلمة المرور");
    }
    throw new Error(err.message || "تعذر تسجيل الدخول");
  }
}

/**
 * Register using Email and Password
 */
export async function registerWithEmail(email: string, password: string, username: string) {
  try {
    const normalizedEmail = email.includes("@") ? email.trim() : `${username.trim().toLowerCase()}@shouma.om`;
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    
    if (username) {
      await updateProfile(result.user, { displayName: username });
    }

    const profile = await syncUserProfile(result.user, {
      username: username.trim(),
      displayName: username.trim(),
      email: normalizedEmail,
    });

    if (profile?.username) {
      localStorage.setItem("shouma-username", profile.username);
    }
    return { user: result.user, profile };
  } catch (err: any) {
    console.error("[FIREBASE REGISTER ERROR]:", err);
    if (err.code === "auth/email-already-in-use") {
      throw new Error("هذا الحساب أو اسم المستخدم مسجل بالفعل، يرجى تسجيل الدخول");
    } else if (err.code === "auth/weak-password") {
      throw new Error("كلمة المرور ضعيفة، يجب أن تحتوي على 6 أحرف أو أرقام على الأقل");
    }
    throw new Error(err.message || "فشل إنشاء الحساب الجديد");
  }
}

/**
 * Sign out
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("shouma-username");
  } catch (err) {
    console.error("Sign out error:", err);
  }
}

/**
 * Save booking to Firestore (both under /users/{userId}/bookings and /bookings)
 */
export async function saveBookingToFirestore(bookingData: {
  userId?: string;
  hotelId?: string;
  hotelName: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  totalPrice: number;
  paymentMethod?: string;
}) {
  const currentUid = auth.currentUser?.uid || "guest_" + Date.now();
  const bookingId = "bk_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const nowIso = new Date().toISOString();

  const payload = {
    id: bookingId,
    userId: currentUid,
    hotelId: bookingData.hotelId || "hotel_1",
    hotelName: bookingData.hotelName,
    guestName: bookingData.guestName,
    guestPhone: bookingData.guestPhone || "",
    guestEmail: bookingData.guestEmail || "",
    checkIn: bookingData.checkIn || nowIso.split("T")[0],
    checkOut: bookingData.checkOut || "",
    nights: bookingData.nights || 1,
    totalPrice: bookingData.totalPrice,
    paymentMethod: bookingData.paymentMethod || "بطاقة بنكية",
    status: "confirmed" as const,
    createdAt: nowIso,
  };

  const path = auth.currentUser ? `users/${currentUid}/bookings/${bookingId}` : `bookings/${bookingId}`;
  try {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", currentUid, "bookings", bookingId);
      await setDoc(userDocRef, payload);
    }
    const globalDocRef = doc(db, "bookings", bookingId);
    await setDoc(globalDocRef, payload);
    return payload;
  } catch (err) {
    console.warn("Could not save to Firestore bookings:", err);
    return payload;
  }
}
