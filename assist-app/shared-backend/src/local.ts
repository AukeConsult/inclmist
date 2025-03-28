import {appConfig} from ".";
import * as admin from "firebase-admin";
import express from "express";
import {Server} from ".";
const firebaseLocal = admin.initializeApp({credential: admin.credential.cert(appConfig.fireBaseServiceAccountKey)});

const expressMain = express()
new Server(expressMain,firebaseLocal)

const PORT = process.env.PORT || 5000;
expressMain.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
