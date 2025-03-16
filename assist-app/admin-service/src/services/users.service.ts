import * as fbAdmin from "firebase-admin";
import { AppUser } from "shared-library";

export const createUser = async (name: string, email: string) => {
    const db = fbAdmin.firestore()
    const userRef = db.collection("users-dummy").doc();
    await userRef.set({ name, email });
    return userRef.id;
};

export const updateUser = async (appUser: AppUser) => {
    const db = fbAdmin.firestore()

    if(appUser.userId && (await db.collection("users").doc(appUser.userId).get()).exists)  {

        const userRef =
            db.collection("users").doc(appUser.userId);

        if(appUser.displayName || appUser.email) {
            await userRef.update({
                displayName: appUser.displayName,
                email: appUser.email
            });
        }

        if(appUser.firebaseUser) {
            await userRef.update({
                firebaseUser: appUser.firebaseUser
            });
        }

        if(appUser.userRecord) {
            await userRef.update({
                userRecord: appUser.userRecord
            });
        }
        return appUser;

    } else {
        const userRef =
            db.collection("users").doc();
        appUser.userRecord = undefined
        await userRef.set(appUser);
        appUser.userId=userRef.id
        return appUser;
    }
};

export const fetchUsers = async () => {
    const db = fbAdmin.firestore()
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map(doc => {
        return ({
                id: doc.id,
                displayName: doc.data().displayName,
                email: doc.data().email,
                photoUrl: doc.data().photoUrl,
                image: doc.data().image
            }
        );
    });
};
