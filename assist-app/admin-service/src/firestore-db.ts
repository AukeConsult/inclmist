import * as admin from "firebase-admin"
import serviceAccount from "../firebase-admin-key.json"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
})

const firestore = admin.firestore()
export default firestore