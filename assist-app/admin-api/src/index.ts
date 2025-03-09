import expressMain from "./express-main"
import { fbAdmin } from "./config/firebase"
import { onRequest } from "firebase-functions/v1/https";
fbAdmin.initializeApp();
exports.admin = onRequest(expressMain)


