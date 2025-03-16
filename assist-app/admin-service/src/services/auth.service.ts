// ✅ Fetch a single user by UID
import {auth} from "firebase-admin";

export const getUserByUID = async (uid: string) => {
    return await auth().getUser(uid);
};

// ✅ Fetch a single user by Email
export const getUserByEmail = async (email: string) => {
    return await auth().getUserByEmail(email);
};

// ✅ Fetch all users (Paginated)
export const listUsers = async (nextPageToken?: string) => {
    return await auth().listUsers(1000, nextPageToken); // Fetch 1000 users per page
};
