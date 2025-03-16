import * as fbAdmin from "firebase-admin";
import * as functions from "firebase-functions/v1";

// ✅ Sync Firebase Auth User to Firestore on Create
export const syncUserOnCreate = functions.auth.user().onCreate(async (userRecord) => {

    if (!userRecord) return;

    const db = fbAdmin.firestore();
    if(!(await db.collection("users").doc(userRecord.uid).get()).exists) {
        await db.collection("users").doc(userRecord.uid).set({
                role: 'user',
                userId: userRecord.uid,
                email: userRecord.email || null,
                displayName: userRecord.displayName || "Unnamed",
                photoURL: userRecord.photoURL,
                userRecord: userRecord,
                createdAt: fbAdmin.firestore.FieldValue.serverTimestamp(),
            }
        );
    } else {
        await db.collection("users").doc(userRecord.uid).update({
                userRecord: userRecord
            }
        );
    }
    console.log(`🔥 User ${userRecord.uid} synced to Firestore`);
});

// ✅ Delete User from Firestore on Auth Deletion
export const deleteUserOnRemove = functions.auth.user().onDelete(async (user) => {
    if (!user) return;

    const db = fbAdmin.firestore();
    await db.collection("users").doc(user.uid).delete();
    console.log(`🗑️ User ${user.uid} deleted from Firestore`);
});
