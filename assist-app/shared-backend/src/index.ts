import { onRequest } from "firebase-functions/v1/https";
import {appConfig} from "./config";
import * as admin from "firebase-admin";
import express from "express";
import Server from "./server";
const firebaseLocal = admin.initializeApp({credential: admin.credential.cert(appConfig.fireBaseServiceAccountKey)});

const expressMain = express()
new Server(expressMain,firebaseLocal)

exports.admin = onRequest(expressMain)