import {ChatDialog, ChatEntry} from "./models/chat-dialog";
import {QueryDescriptor} from "./models/query-descriptor";
import { Guid } from "guid-typescript";

const activeDialogs = new Map<string, ChatDialog>
const activeQueryDescriptor = new Map<string, QueryDescriptor>

export class ChatStorage {
    constructor() {}

    public saveMessage(userId: string, chatMessage: ChatEntry) {
        if(!chatMessage.dialogId) {
            const dialog = {
                id: Guid.create().toString(),
                userId: userId,
                name: chatMessage.ask.message,
                entries: [],
                queryDescriptor: this.getQueryDecription(chatMessage.queryId,chatMessage.profileId)
            } as ChatDialog
            this.saveDialog(dialog)
            chatMessage.dialogId=dialog.id
        }
        if(chatMessage.dialogId) {
            const dialog = this.getDialog(chatMessage.dialogId)
            if(dialog) {
                chatMessage.counter = dialog.entries?.length
                dialog.entries.push(chatMessage)
                this.saveDialog(dialog)
            }
        }
    }
    public saveDialog(dialog: ChatDialog) {
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
                profileId: profileId
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