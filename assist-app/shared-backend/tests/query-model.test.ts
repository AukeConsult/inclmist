import {appConfig} from "../src/config";
import {ChatEntry} from "shared-library"
import {QueryModels} from "../src/models/query-models"
import * as firebase from "firebase-admin"
firebase.initializeApp({credential: firebase.credential.cert(appConfig.fireBaseServiceAccountKey)});

const model = new QueryModels(firebase.firestore())

describe('Query model', () => {

    it('Simple one message', async () => {
        const ret = await model.simpleMessage("what is firebase")
    })

    it('chatenty one message', async () => {
        const chatEntry: ChatEntry = {
            uid: "leif",
            entry: [
                {role: "user", content: "hello chatgpt"}
            ]
        }
        const ret = await model.chatMessage(chatEntry)
    })

    it('chatenty 2 messages with history', async () => {
        const chatEntry: ChatEntry = {
            uid: "leif",
            entry: [
                {role: "user", content: "what is firebase"}
            ]
        }
        const ret = await model.chatMessage(chatEntry)
        expect(ret).toBeDefined()
        expect(ret.history).toBeDefined()
        expect(ret.replies).toBeDefined()
        expect(ret.history?.length).toBe(1)

        chatEntry.replies = undefined
        chatEntry.entry = [
            {role: "user", content: "is it a good tool"}
        ]
        const ret2 = await model.chatMessage(chatEntry)
        expect(ret2).toBeDefined()
        expect(ret2.history).toBeDefined()
        expect(ret2.replies).toBeDefined()
        expect(ret2.history?.length).toBe(2)

    },1000*300)

});
