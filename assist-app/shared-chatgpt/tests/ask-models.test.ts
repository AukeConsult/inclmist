import { AskModels } from "../src/ask-models"
import {ChatStorage} from "../src/services/chat-storage";
import {ChatEntry, ChatMessage} from "../src/models/chat-dialog";
import {Guid} from "guid-typescript";

const userId = Guid.create().toString()

describe('test simple chat', () => {

    it('open simple chat',  async () => {
        const chatStorage = new ChatStorage()
        const s = new AskModels(chatStorage);
        const retMessage = await s.askQuestion({
            userId: userId,
            queryDescriptor: {
                profileId: "leifprofile",
                queryParameters: [{
                    modelId: 'gpt-4',
                    instructions: "This is a test"
                }]
            },
            entry: [{
                content: "hello"
            }] as ChatMessage []
        } as ChatEntry)
        expect(retMessage).toBeDefined()
        if (retMessage) {
            expect(retMessage.replies).toBeDefined()
            expect(chatStorage.getDialog(retMessage)).toBeDefined()
            console.log(retMessage)
        } else {
            console.log("no message")
        }
    },1000*300);

    it('make some messages', async () => {
        const chatStorage = new ChatStorage()
        const s = new AskModels(chatStorage);
        var retMessage = await s.askQuestion({
            userId: userId,
            queryDescriptor: {
                profileId: "leifprofile",
                queryParameters: [{
                    modelId: 'gpt-4',
                    instructions: "This is a test for chatgpt, please be short"
                }]
            },
            entry: [{
                content: "hello, how to program"
            }]
        } as ChatEntry)
        expect(retMessage).toBeDefined()
        const questions = [
            "java",
            "explain more",
            "is there better languages",
            "what about java"
        ]
        if(retMessage) {

            expect(chatStorage.getDialog(retMessage)).toBeDefined()

            const retObject = await chatStorage.readDialog({userId: retMessage.userId, dialogId: retMessage.dialogId})
            expect(retObject.chatDialog).toBeDefined()
            //expect(retObject.chatDialog?.entries.length).toBe(1)

            for (let i = 1; i <= 3; i++) {
                retMessage.entry = [{
                    content: questions[i]
                } ]
                retMessage = await s.askQuestion(retMessage)
                expect(retMessage).toBeDefined()
                if(retMessage) {
                    //expect(chatStorage.readDialog(retMessage)?.entries.length).toBe(i+1)
                    console.log("result", retMessage)
                }
            }
        }
    },1000*60);

});