import { deleteUserOnRemove } from "./triggers/authSync";
import {onCall, onRequest} from "firebase-functions/v2/https";
import {getUserByEmail, getUserByUID, listUsers} from "./services/auth.service";
import {createUser, fetchUsers, updateUser} from "./services/users.service";
import * as admin from "firebase-admin";
import {Server} from "./shared-backend";

import express from "express";
const firebaseLocal = admin.initializeApp();

const expressMain = express()
new Server(expressMain,firebaseLocal)

exports.backend = onRequest(expressMain)

exports.deleteUserOnRemove = deleteUserOnRemove;
exports.createUser = onCall(async (request) => {
    return createUser(request.data.name, request.data.email)
})
exports.updateUser = onCall(async (request) => {
    return updateUser(request.data.appUser)
})

exports.fetchUsers = onCall(async () => {
    return fetchUsers()
})

exports.getUserById = onCall(async (request) => {
    return getUserByUID(request.data.uid)
})

exports.getUserByEmail = onCall(async (request) => {
    return getUserByEmail(request.data.email)
})

exports.listUsers = onCall(async () => {
    return listUsers()
})

