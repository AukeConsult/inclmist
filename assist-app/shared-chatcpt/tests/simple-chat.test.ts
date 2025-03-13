import { SimpleChat } from "../src/simple-chat"
import {ChatStorage} from "../src/chat-storage";
import {ChatEntry, ChatMessage} from "../src/models/chat-dialog";

describe('test simple chat', () => {

    // it('make query def', () => {
    //     const chatStorage = new ChatStorage()
    //     const q = chatStorage.getQueryDecription("test",undefined)
    //     expect(q).toBeDefined()
    //     expect(chatStorage.getQueryList()).toBeDefined()
    //     expect(chatStorage.getQueryList().length).toBe(1)
    //     chatStorage.getQueryDecription("test2",undefined)
    //     expect(chatStorage.getQueryList().length).toBe(2)
    // });


    it('open simple chat',  async () => {
        const chatStorage = new ChatStorage()
        const s = new SimpleChat(chatStorage);
        const q = chatStorage.getQueryDecription("test", "profile1")
        let dialogId = undefined
        if (q) {
            const retMessage = await s.sendMessage("leif", {
                queryId: q.id,
                profileId: q.profileId,
                dialogId: undefined,
                entry: {
                    content: "hello"
                } as ChatMessage
            } as ChatEntry)
            expect(retMessage).toBeDefined()
            if (retMessage) {
                expect(chatStorage.getDialog(retMessage.dialogId)).toBeDefined()
                console.log(retMessage.entry)
            } else {
                console.log("no message")
            }
        }
    });

    // it('make some messages', async () => {
    //     const chatStorage = new ChatStorage()
    //     const s = new SimpleChat(chatStorage);
    //     const q = chatStorage.getQueryDecription("test", "profile1")
    //     let dialogId = undefined
    //     if (q) {
    //         var message = await s.sendMessage("leif", {
    //             queryId: q.id,
    //             entry: {
    //                 message: "hello"
    //             } as ChatMessage
    //         } as ChatEntry)
    //         expect(message).toBeDefined()
    //         if(message) {
    //
    //             dialogId = message.dialogId
    //             for (let i = 1; i < 10; i++) {
    //                 message = await s.sendMessage("leif", {
    //                     queryId: q.id,
    //                     dialogId: dialogId,
    //                     entry: {
    //                         message: "hello " + i
    //                     } as ChatMessage
    //                 } as ChatEntry)
    //                 expect(message).toBeDefined()
    //                 if(message) {
    //                     expect(message.counter).toBe((i + 1)*2)
    //
    //                 }
    //             }
    //         }
    //     }
    //     expect(chatStorage.getDialog(dialogId)).toBeDefined()
    //     expect(chatStorage.getDialog(dialogId)?.queryDescriptor).toBe(q)
    // });

});