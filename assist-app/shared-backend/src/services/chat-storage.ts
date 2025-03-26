import {ChatDialog, ChatEntry} from "shared-library/src/models/chat-dialog";
import {
    QueryDescriptor,
    AppUserWork
} from "shared-library";
import {firestore} from "firebase-admin";

export class ChatStorage {

    private userCollection

    constructor(db: firestore.Firestore) {
        this.userCollection = db.collection("users-work")
    }

    public async storeChatEntry(chatEntry: ChatEntry) {

        if(chatEntry.uid && chatEntry.did) {

            chatEntry.timeStamp = Date.now()
            const dialogRef
                = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc(chatEntry.did)

            const entryRef = dialogRef.collection("entries").doc()
            await entryRef.set(chatEntry)
            if(chatEntry.qid) {
                dialogRef.update ({qid: chatEntry.qid})
            }

        } else {
            chatEntry.error = "NO-DIALOG"
        }
        return chatEntry

    }
    async initEntry(chatEntry: ChatEntry)  {

        var userRef = this.userCollection.doc()
        if(chatEntry.uid) {
            userRef = this.userCollection.doc(chatEntry.uid)
        }

        if (!chatEntry.uid || !(await userRef.get()).exists) {
            await userRef.set(
                {
                    role: 'user'
                } as AppUserWork
            )
            chatEntry.uid = userRef.id
            await this.userCollection.doc(userRef.id).update({uid: userRef.id})
        }

        if(chatEntry.queryDescriptor) {

            const queryCollection = this.userCollection.doc(chatEntry.uid).collection("queries")
            if(!chatEntry.qid) {
                const queryRef = queryCollection.doc()
                await queryRef.set(chatEntry.queryDescriptor)
                chatEntry.qid = queryRef.id
            } else {
                const queryRef = queryCollection.doc(chatEntry.qid)
                await queryRef.set(chatEntry.queryDescriptor)
            }
        }

        if(chatEntry.entry) {

            var dialogRef = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc()
            if(chatEntry.did) {
                dialogRef = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc(chatEntry.did)
            }
            if (!chatEntry.did || !(await dialogRef.get()).exists) {
                const title = chatEntry.entry[0].content
                const dialog = {
                    uid: chatEntry.uid,
                    title: title,
                } as ChatDialog

                const dialogRef
                    = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc()
                await dialogRef.set(dialog)
                chatEntry.did = dialogRef.id
            }
        }
        return chatEntry

    }

    async getDialog(chatEntry: ChatEntry) {
        if(chatEntry.uid && chatEntry.did) {
            const col = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc(chatEntry.did)
            return {...(await col.get()).data()} as ChatDialog
        } else {
            return undefined
        }
    }

    async getQueryDecription(chatEntry: ChatEntry) : Promise<QueryDescriptor | undefined>  {
        if(chatEntry.uid && chatEntry.qid) {
            return {...(await this.userCollection.doc(chatEntry.uid).collection("queries").doc(chatEntry.qid).get()).data()} as QueryDescriptor
        } else {
            return undefined
        }
    }

    public async readDialog(dialogRef: {uid: string, did: string}) : Promise<ChatDialog> {
        const dialogs = this.userCollection.doc(dialogRef.uid).collection("dialogs")
        return dialogs.doc(dialogRef.uid).get()
            .then(async (r)=> {
                const snap = await r.ref.collection("dialogs").get()
                const dialog = r.data() as ChatDialog
                snap.forEach((c)=> {
                    dialog.entries.push(c.data() as ChatEntry)
                })
                return dialog
            })
    }
}