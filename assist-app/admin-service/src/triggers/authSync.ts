import { fbAdmin } from "../config/firebase";
import * as functions from "firebase-functions/v1";

// ✅ Sync Firebase Auth User to Firestore on Create
export const syncUserOnCreate = functions.auth.user().onCreate(async (user) => {
    if (!user) return;

    const db = fbAdmin.firestore();
    await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || "Unnamed",
        createdAt: fbAdmin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`🔥 User ${user.uid} synced to Firestore`);
});

// ✅ Delete User from Firestore on Auth Deletion
export const deleteUserOnRemove = functions.auth.user().onDelete(async (user) => {
    if (!user) return;

    const db = fbAdmin.firestore();
    await db.collection("users").doc(user.uid).delete();
    console.log(`🗑️ User ${user.uid} deleted from Firestore`);
});
