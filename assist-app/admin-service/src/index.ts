import { syncUserOnCreate, deleteUserOnRemove } from "./triggers/authSync";
import expressMain from "./express-main"
import { fbAdmin } from "./config/firebase"
import { onRequest } from "firebase-functions/v1/https";

// fbAdmin.initializeApp({
//     credential: fbAdmin.credential.cert(serviceAccount as fbAdmin.ServiceAccount)
// });
fbAdmin.initializeApp();
// ✅ Export Firebase Functions
exports.syncUserOnCreate = syncUserOnCreate;
exports.deleteUserOnRemove = deleteUserOnRemove;
exports.admin = onRequest(expressMain)


