import {ChatDialog, ChatEntry, ChatMessage} from "../models/chat-dialog";
import {QueryDescriptor} from "../models/query-descriptor";
import { Guid } from "guid-typescript";

const activeDialogs = new Map<string, ChatDialog>
const activeQueryDescriptor = new Map<string, QueryDescriptor>

export class ChatStorage {
    constructor() {}
    public storeChatEntry(userId: string, chatEntry: ChatEntry, results: ChatMessage[]): ChatEntry {

        const dialog = this.getDialog(chatEntry)
        if(dialog) {

            chatEntry.replies = results
            chatEntry.counter = dialog.entries.length

            dialog.entries.push(chatEntry)

            dialog.queryId = chatEntry.queryId
            dialog.queryDescriptor = chatEntry.queryDescriptor

            activeDialogs.set(dialog.id,dialog)

            // store query descriptor
            if(chatEntry.queryDescriptor) {
                if(!chatEntry.queryDescriptor.id) {
                    chatEntry.queryDescriptor.id = Guid.create().toString()
                }
                activeQueryDescriptor.set(chatEntry.queryDescriptor.id,chatEntry.queryDescriptor)
            }
        } else {
            chatEntry.error = "NO-DIALOG"
        }
        return chatEntry

    }
    public getDialog(chatEntry: ChatEntry) :ChatDialog | undefined {
        if(!chatEntry.dialogId && chatEntry.entry) {
            const title = chatEntry.entry[0].content
            const dialog = {
                id: Guid.create().toString(),
                userId: chatEntry.userId,
                title: title,
                queryId: chatEntry.queryId,
                profileId: chatEntry.profileId,
                entries: [],
                history: []
            } as ChatDialog
            chatEntry.dialogId=dialog.id
            activeDialogs.set(dialog.id,dialog)
        }

        if(chatEntry.dialogId) {
            return activeDialogs.get(chatEntry.dialogId)
        } else return undefined
    }
    public getQueryDecription(queryId: string | undefined, profileId: string | undefined, ) : QueryDescriptor | undefined {
        if(!queryId || !activeQueryDescriptor.has(queryId)) {
            const q = {
                id: Guid.create().toString(),
                profileId: profileId,
                queryParameters: [{
                    modelId: 'gpt-4',
                    instructions: "This is a test"
                }]
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