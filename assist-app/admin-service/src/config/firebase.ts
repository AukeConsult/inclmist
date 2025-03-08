import * as admin from "firebase-admin";
import * as serviceAccount from "../../firebase-admin-key.json"; // Ensure this file exists

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://collect-server-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
export { admin, db };
