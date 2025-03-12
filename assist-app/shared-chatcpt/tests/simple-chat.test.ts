import { SimpleChat } from "../src/simple-chat"
import {ChatStorage} from "../src/chat-storage";
import {ChatEntry, ChatMessage} from "../src/models/chat-dialog";

describe('test simple chat', () => {
    it('print log', () => {
        console.log("started test")
    });

    it('make querydef', () => {
        const chatStorage = new ChatStorage()
        const q = chatStorage.getQueryDecription("test",undefined)
        expect(q).toBeDefined()
        expect(chatStorage.getQueryList()).toBeDefined()
        expect(chatStorage.getQueryList().length).toBe(1)
        chatStorage.getQueryDecription("test2",undefined)
        expect(chatStorage.getQueryList().length).toBe(2)
    });


    it('open simple chat', async () => {
        const chatStorage = new ChatStorage()
        const s = new SimpleChat(chatStorage);
        const q = chatStorage.getQueryDecription("test", "profile1")
        var dialogId
        if (q) {
            const message = await s.sendMessage("leif", {
                queryId: q.id,
                ask: {
                    message: "hello"
                } as ChatMessage
            } as ChatEntry)
            dialogId = message.dialogId
        }
        expect(chatStorage.getDialog(dialogId)).toBeDefined()
        expect(chatStorage.getDialog(dialogId)?.queryDescriptor).toBe(q)
    });

    it('make some messages', async () => {
        const chatStorage = new ChatStorage()
        const s = new SimpleChat(chatStorage);
        const q = chatStorage.getQueryDecription("test", "profile1")
        var dialogId
        if (q) {
            var message = await s.sendMessage("leif", {
                queryId: q.id,
                ask: {
                    message: "hello"
                } as ChatMessage
            } as ChatEntry)
            dialogId = message.dialogId
            for (let i = 0; i < 10; i++) {
                message = await s.sendMessage("leif", {
                    queryId: q.id,
                    dialogId: message.dialogId,
                    ask: {
                        message: "hello " + i
                    } as ChatMessage,
                    history: message.history
                } as ChatEntry)
                expect(message.counter).toBe(i + 1)
                console.log(message)
            }
        }
        expect(chatStorage.getDialog(dialogId)).toBeDefined()
        expect(chatStorage.getDialog(dialogId)?.queryDescriptor).toBe(q)
    });

});