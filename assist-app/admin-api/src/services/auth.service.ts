import { fbAdmin } from "../config/firebase";

// ✅ Fetch a single user by UID
export const getUserByUID = async (uid: string) => {
    return await fbAdmin.auth().getUser(uid);
};

// ✅ Fetch a single user by Email
export const getUserByEmail = async (email: string) => {
    return await fbAdmin.auth().getUserByEmail(email);
};

// ✅ Fetch all users (Paginated)
export const listUsers = async (nextPageToken?: string) => {
    return await fbAdmin.auth().listUsers(1000, nextPageToken); // Fetch 1000 users per page
};
