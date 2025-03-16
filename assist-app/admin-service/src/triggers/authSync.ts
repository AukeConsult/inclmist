import * as functions from "firebase-functions/v1";
import {firestore} from "firebase-admin";

// ✅ Sync Firebase Auth User to Firestore on Create
exports.syncUserOnCreate = functions.auth.user().onCreate(async (user) => {
    // Set up default values for extended attributes
    const additionalUserData = {
        address: '',
        jobTitle : ''
        // other fields can be initialized here
    };

    // Merge auth user data with additional data
    const fullUserData = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || "Unnamed",
        emailVerified: user.emailVerified,
        ...additionalUserData,
        createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
        await firestore().collection('users').doc(user.uid).set(fullUserData);
        console.log(`User ${user.uid} synced to Firestore with extended attributes`);
    } catch (error) {
        console.error('Error syncing user to Firestore:', error);
    }
});

// ✅ Delete User from Firestore on Auth Deletion
export const deleteUserOnRemove = functions.auth.user().onDelete(async (user) => {
    if (!user) return;

    const db = firestore();
    await db.collection("users").doc(user.uid).delete();
    console.log(`🗑️ User ${user.uid} deleted from Firestore`);
});

