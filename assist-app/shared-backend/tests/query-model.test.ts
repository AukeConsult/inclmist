import backendApp from "../src";
import {ChatEntry} from "shared-library"

describe('Query model', () => {

    it('Simple one message', async () => {
        const model = backendApp.queryModels
        const ret = await model.simpleMessage("what is firebase")
        console.log(ret)
    })

    it('chatenty one message', async () => {
        const model = backendApp.queryModels
        const chatEntry: ChatEntry = {
            entry: [
                {role: "user", content: "hello chatgpt"}
            ]
        }
        const ret = await model.chatMessage(chatEntry)
        console.log(ret)
    })

    it('chatenty 2 messages with history', async () => {
        const model = backendApp.queryModels
        const chatEntry: ChatEntry = {
            entry: [
                {role: "user", content: "what is firebase"}
            ]
        }
        const ret = await model.chatMessage(chatEntry)
        expect(ret).toBeDefined()
        expect(ret.history).toBeDefined()
        expect(ret.replies).toBeDefined()
        expect(ret.history?.length).toBe(1)

        console.log(ret)

        chatEntry.replies = undefined
        chatEntry.entry = [
            {role: "user", content: "is it a good tool"}
        ]
        const ret2 = await model.chatMessage(chatEntry)
        expect(ret2).toBeDefined()
        expect(ret2.history).toBeDefined()
        expect(ret2.replies).toBeDefined()
        expect(ret2.history?.length).toBe(2)

        console.log(ret2)


    },1000*300)


});



