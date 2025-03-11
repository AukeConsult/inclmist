import { SimpleChat } from "../src/simple-chat"
import {ChatStorage} from "../src/chat-storage";
import {ChatEntry, ChatMessage} from "../src/models/chat-dialog";

describe('test simple chat', () => {
    it('print log', () => {
        console.log("started test")
    });

    it('make querydef', () => {
        const chatStorage = new ChatStorage()
        const s = new SimpleChat(chatStorage);
        const q = chatStorage.getQueryDecription("test",undefined)
        expect(q).toBeDefined()
        expect(chatStorage.getQueryList()).toBeDefined()
        expect(chatStorage.getQueryList().length).toBe(1)
        chatStorage.getQueryDecription("test2",undefined)
        expect(chatStorage.getQueryList().length).toBe(2)
    });


    it('open simple chat', () => {
        const chatStorage = new ChatStorage()
        const s = new SimpleChat(chatStorage);
        const q = chatStorage.getQueryDecription("test","profile1")
        var dialogId
        if(q) {
            const message = s.sendMessage("leif",{
                queryId: q.id,
                ask: {
                    message: "hello"
                } as ChatMessage
            } as ChatEntry)
            dialogId=message.dialogId
        }
        expect(chatStorage.getDialog(dialogId)).toBeDefined()
        expect(chatStorage.getDialog(dialogId)?.queryDescriptor).toBe(q)
    });

});