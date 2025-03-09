import { syncUserOnCreate, deleteUserOnRemove } from "./triggers/authSync";
import * as fbAdmin from "firebase-admin";
import {onCall} from "firebase-functions/v2/https";
import {getUserByEmail, getUserByUID, listUsers} from "./services/auth.service";
import {createUser, fetchUsers} from "./services/users.service";

fbAdmin.initializeApp();

exports.syncUserOnCreate = syncUserOnCreate;
exports.deleteUserOnRemove = deleteUserOnRemove;

exports.test = onCall(() => {
    return {message: "hello"}
})

exports.createUser = onCall(async (request) => {
    return createUser(request.data.name, request.data.email)
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

exports.listUsers = onCall(async () => {
    return listUsers()
})

