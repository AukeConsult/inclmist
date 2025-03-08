import { admin } from "../config/firebase";

// ✅ Fetch a single user by UID
export const getUserByUID = async (uid: string) => {
    return await admin.auth().getUser(uid);
};

// ✅ Fetch a single user by Email
export const getUserByEmail = async (email: string) => {
    return await admin.auth().getUserByEmail(email);
};

// ✅ Fetch all users (Paginated)
export const listUsers = async (nextPageToken?: string) => {
    return await admin.auth().listUsers(1000, nextPageToken); // Fetch 1000 users per page
};
