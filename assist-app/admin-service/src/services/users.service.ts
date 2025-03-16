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

    if(appUser.uid && (await db.collection("users").doc(appUser.uid).get()).exists)  {

        const userRef =
            db.collection("users").doc(appUser.uid);

        if(appUser.displayName || appUser.email) {
            await userRef.update({
                displayName: appUser.displayName,
                email: appUser.email
            });
        }

        return appUser;

    } else {
        const userRef =
            db.collection("users").doc();
        await userRef.set(appUser);
        appUser.uid=userRef.id
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
