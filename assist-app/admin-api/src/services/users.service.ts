import { fbAdmin } from "../config/firebase";

export const createUser = async (name: string, email: string) => {
    const db = fbAdmin.firestore()
    const userRef = db.collection("users").doc();
    await userRef.set({ name, email });
    return userRef.id;
};

export const fetchUsers = async () => {
    const db = fbAdmin.firestore()
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
