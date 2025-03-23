// import {
//     ChatEntry,
//     ChatMessage,
//     ModelEnum,
//     VendorEnum
// } from "shared-library";
//
// import * as admin from "firebase-admin";
// import backendApp, {appConfig} from "../src";
//
// const app = admin.initializeApp({credential: admin.credential.cert(appConfig.fireBaseServiceAccountKey)})
// const userId = "leif"
//
// describe('test simple chat without modelel intracation', () => {
//
//     it('open simple chat',  async () => {
//
//         const model = backendApp.trainModels(app,true);
//         const chatStorage = model.storeage
//
//         const retMessage = await model.sendEntry({
//             uid: "leif2",
//             pid: "leifprofile",
//             queryDescriptor: {
//                 queryParameters: [{
//                     vendor: VendorEnum.chatGpt,
//                     modelId: ModelEnum.gpt4,
//                     instructions: "This is a test"
//                 }]
//             },
//             entry: [{
//                 content: "hello"
//             }] as ChatMessage []
//         } as ChatEntry)
//         expect(retMessage).toBeDefined()
//         if (retMessage) {
//             expect(retMessage.replies).toBeDefined()
//             expect(chatStorage.getDialog(retMessage)).toBeDefined()
//             console.log(retMessage)
//         } else {
//             console.log("no message")
//         }
//
//
//     },1000*300);
//
//     it('open simple chat empty userid',  async () => {
//
//         const model = backendApp.trainModels(app,true);
//         const chatStorage = model.storeage
//
//         const retMessage = await model.sendEntry({
//             queryDescriptor: {
//                 queryParameters: [{
//                     vendor: VendorEnum.chatGpt,
//                     modelId: ModelEnum.gpt4,
//                     instructions: "This is a test"
//                 }]
//             },
//             entry: [{
//                 content: "hello"
//             }] as ChatMessage []
//         } as ChatEntry)
//         expect(retMessage).toBeDefined()
//         if (retMessage) {
//             expect(retMessage.replies).toBeDefined()
//             expect(chatStorage.getDialog(retMessage)).toBeDefined()
//         } else {
//             console.log("no message")
//         }
//
//         const db = admin.firestore()
//         const userRef = db.collection("usersWork").doc(retMessage.uid)
//         const user = await userRef.get()
//         expect(user).toBeDefined()
//
//         const docRef = db.collection(`usersWork/${retMessage.uid}/trainProfiles/`).select("pid", "name")
//         const profiles = await docRef.get()
//         expect(profiles).toBeDefined()
//         profiles.forEach(doc=> {
//             const r = doc.data()
//             expect(r.name).toBeDefined()
//             expect(r.pid).toBeDefined()
//             expect(r.pid).toBe(retMessage.pid)
//         })
//         await userRef.delete()
//
//     },1000*300);
//
//     it('open simple chat empty profile',  async () => {
//
//         const model = backendApp.trainModels(app,true);
//         const chatStorage = model.storeage
//
//         const retMessage = await model.sendEntry({
//             uid: userId,
//             queryDescriptor: {
//                 queryParameters: [{
//                     vendor: VendorEnum.chatGpt,
//                     modelId: ModelEnum.gpt4,
//                     instructions: "This is a test"
//                 }]
//             },
//             entry: [{
//                 content: "hello"
//             }] as ChatMessage []
//         } as ChatEntry)
//         expect(retMessage).toBeDefined()
//         if (retMessage) {
//             expect(retMessage.replies).toBeDefined()
//             expect(chatStorage.getDialog(retMessage)).toBeDefined()
//             console.log(retMessage)
//         } else {
//             console.log("no message")
//         }
//
//
//
//     },1000*300);
//
//     it('make some messages', async () => {
//
//         const model = backendApp.trainModels(app,true);
//         const chatStorage = model.storeage
//
//         var retMessage = await model.sendEntry({
//             uid: userId,
//             pid: "leifprofile2",
//             queryDescriptor: {
//                 queryParameters: [{
//                     vendor: VendorEnum.chatGpt,
//                     modelId: ModelEnum.gpt4,
//                     instructions: "This is a test for chatgpt, please be short"
//                 }]
//             },
//             entry: [{
//                 content: "hello, how to program"
//             }]
//         } as ChatEntry)
//         expect(retMessage).toBeDefined()
//         const questions = [
//             "java",
//             "explain more",
//             "is there better languages",
//             "what about java"
//         ]
//
//         if(retMessage) {
//
//             expect(chatStorage.getDialog(retMessage)).toBeDefined()
//
//             const retDialog = await chatStorage.readDialog({pid: retMessage.pid, did: retMessage.did})
//             expect(retDialog).toBeDefined()
//             expect(retDialog?.entries.length).toBe(1)
//
//             for (let i = 1; i <= 3; i++) {
//                 retMessage.entry = [{
//                     content: questions[i]
//                 } ]
//                 retMessage = await model.sendEntry(retMessage)
//                 expect(retMessage).toBeDefined()
//                 if(retMessage) {
//                     const retDialog = await chatStorage.readDialog({pid: retMessage.pid, did: retMessage.did})
//                     //console.log("dialog", retDialog)
//                     expect(retDialog?.entries.length).toBe(i+1)
//                     console.log("result", retMessage)
//                 }
//             }
//         }
//
//         const db = admin.firestore()
//         const docRef = db.collection("usersWork/leif/trainProfiles/").where("pid","==","leifprofile2").select("pid", "name")
//         const profiles = await docRef.get()
//         expect(profiles).toBeDefined()
//         profiles.forEach(doc=> {
//             const r = doc.data()
//             expect(r.name).toBeDefined()
//             expect(r.pid).toBeDefined()
//             expect(r.pid).toBe("leifprofile2")
//             console.log(doc.data())
//         })
//
//     },1000*200);
//
// });