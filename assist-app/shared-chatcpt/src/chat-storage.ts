import {ChatDialog, ChatEntry, ChatMessage} from "./models/chat-dialog";
import {QueryDescriptor} from "./models/query-descriptor";
import { Guid } from "guid-typescript";

const activeDialogs = new Map<string, ChatDialog>
const activeQueryDescriptor = new Map<string, QueryDescriptor>

export class ChatStorage {
    constructor() {}
    public storeChatEntry(userId: string, chatEntry: ChatEntry): ChatEntry | undefined {
        if(!chatEntry.dialogId) {

            const dialog = {
                id: Guid.create().toString(),
                userId: userId,
                description: chatEntry.entry.content,
                queryId: chatEntry.queryId,
                profileId: chatEntry.profileId,
            } as ChatDialog

            this.storeDialog(dialog, chatEntry)
            chatEntry.dialogId=dialog.id

        }

        if(chatEntry.dialogId) {
            const dialog = this.getDialog(chatEntry.dialogId)
            if(dialog) {
                chatEntry.counter = dialog.entries?.length
                this.storeDialog(dialog, chatEntry)
                return chatEntry
            }
        }
        return undefined

    }
    public storeDialog(dialog: ChatDialog, chatMessage: ChatEntry) {

        if(!dialog.entries)dialog.entries = []
        if(!dialog.history)dialog.history = []

        dialog.entries.push(chatMessage)
        dialog.history.push({
            role: chatMessage.entry.role,
            content: chatMessage.entry.content
        } as ChatMessage)
        activeDialogs.set(dialog.id,dialog)

    }
    public getDialog(dialogId: string | undefined) :ChatDialog | undefined {
        if(dialogId) {
            return activeDialogs.get(dialogId)
        } else return undefined
    }
    public getQueryDecription(queryId: string | undefined, profileId: string | undefined, ) :QueryDescriptor | undefined {
        if(!queryId || !activeQueryDescriptor.has(queryId)) {
            const q = {
                id: Guid.create().toString(),
                profileId: profileId,
                queryChatGpt: {
                    modelId: 'gpt-4',
                    instructions: "This is a test"
                }
            } as QueryDescriptor
            activeQueryDescriptor.set(q.id,q)
            return q;
        } else {
            return activeQueryDescriptor.get(queryId)
        }
    }
    public getQueryList() {
        return [...activeQueryDescriptor.values()]
    }
    public getDialogList(userid: string) {
        return [...activeDialogs.values()].filter((item)=>item.userId===userid)
    }

}