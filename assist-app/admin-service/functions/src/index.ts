import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";
import { syncUserOnCreate, deleteUserOnRemove } from "./authSync";

// ✅ Initialize Firebase Admin (only once!)
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// ✅ Export Firebase Functions
exports.syncUserOnCreate = syncUserOnCreate;
exports.deleteUserOnRemove = deleteUserOnRemove;
