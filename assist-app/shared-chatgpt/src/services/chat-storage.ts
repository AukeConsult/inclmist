import {ChatDialog, ChatEntry, ChatMessage} from "../models/chat-dialog";
import {QueryDescriptor} from "../models/query-descriptor";
import * as admin from "firebase-admin";
import {fireBaseAdminKey} from "../secrets";
import {ServiceAccount} from "firebase-admin/lib/app/credential";
import {ProfileAdminUser, ProfileAdminUsers, ProfileQueries, ProfileSubscription} from "../models/profile-info";
import {ReturnObj} from "../models/return-obj";

const activeDialogs = new Map<string, ChatDialog>
const activeQueryDescriptor = new Map<string, QueryDescriptor>

admin.initializeApp({credential: admin.credential.cert(fireBaseAdminKey as ServiceAccount)})

const db = admin.firestore()
const userCollection = db.collection("users-test")
const profilesCollection = db.collection("profiles-test")

export class ChatStorage {
    constructor() {}

    public async storeChatEntry(chatEntry: ChatEntry, results: ChatMessage[]) {

        if(await this.initEntry(chatEntry)) {

            if(chatEntry.userId && chatEntry.dialogId && chatEntry.profileId) {

                chatEntry.timeStamp = Date.now()
                chatEntry.replies = results
                const dialogRef
                    = userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId)

                const entryRef = dialogRef.collection("entries").doc()
                await entryRef.set(chatEntry)
                dialogRef.update({
                    queryId: chatEntry.queryId,
                    queryDescriptor: chatEntry.queryDescriptor
                })

            } else {
                chatEntry.error = "NO-DIALOG"
            }
        } else {
            chatEntry.error = "NO-PROFILE"
        }
        return chatEntry

    }
    public async initEntry(chatEntry: ChatEntry)  {

        if (!chatEntry.userId) {
            const doc = userCollection.doc()
            await doc.set({active: false, userName: "dummy user"})
            chatEntry.userId = doc.id
        }
        if(!(await userCollection.doc(chatEntry.userId).get()).exists) {
            userCollection.doc(chatEntry.userId).set({active: false, userName: "dummy user"})
        }

        var profileRef = profilesCollection.doc()
        if(chatEntry.profileId) {
            profileRef = profilesCollection.doc(chatEntry.profileId)
        }

        if (!chatEntry.profileId || !(await profileRef.get()).exists) {

            const profile = {
                public: false,
                profileName: chatEntry.userId,
                ownerName: chatEntry.userId,
                ownerId: chatEntry.userId,
                pictures: [],
                links: [],
                adminUsers: {
                    canUpdate: true,
                    users:
                        [
                            {userId: chatEntry.userId, role: "admin", name: "no name"}
                        ] as ProfileAdminUser[]
                    } as ProfileAdminUsers
                }

            await profileRef.set(profile)
            chatEntry.profileId = profileRef.id

        }

        if(chatEntry.queryDescriptor && chatEntry.profileId) {

            const profileRef = profilesCollection.doc(chatEntry.profileId)
            const queryCollection = profileRef.collection("queries")

            if(!chatEntry.queryId) {
                const queryRef = queryCollection.doc()
                await queryRef.set(chatEntry.queryDescriptor)
                chatEntry.queryId = queryRef.id
            } else {
                const queryRef = queryCollection.doc(chatEntry.queryId)
                await queryRef.set(chatEntry.queryDescriptor)
            }

        }

        if (!chatEntry.dialogId && chatEntry.entry) {

            const title = chatEntry.entry[0].content
            const dialog = {
                userId: chatEntry.userId,
                title: title,
                queryId: chatEntry.queryId,
                profileId: chatEntry.profileId
            } as ChatDialog

            const dialogRef
                = userCollection.doc(chatEntry.userId).collection("dialogs").doc()
            await dialogRef.set(dialog)
            chatEntry.dialogId = dialogRef.id

        }

        if (chatEntry.dialogId) {
            return (await userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId).get()).exists
        } else {
            return false
        }
    }

    public async getDialog(chatEntry: ChatEntry) {
        if(chatEntry.userId && chatEntry.dialogId) {
            const col = userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId)
            return {...(await col.get()).data()} as ChatDialog
        } else {
            return undefined
        }
    }

    public async getQueryDecription(chatEntry: ChatEntry) : Promise<QueryDescriptor | undefined>  {
        if(chatEntry.profileId && chatEntry.queryId) {
            return {...(await profilesCollection.doc(chatEntry.profileId).collection("queries").doc(chatEntry.queryId).get()).data()} as QueryDescriptor
        } else {
            return undefined
        }
    }

    public async readDialog(dialogRef: {userId: string, dialogId: string}) : Promise<ReturnObj> {
        const dialogs = userCollection.doc(dialogRef.userId).collection("dialogs")
        return dialogs.doc(dialogRef.dialogId).get()
            .then(async (r)=> {
                const snap = await r.ref.collection("dialogs").get()
                const dialog = r.data() as ChatDialog
                snap.forEach((c)=> {
                    dialog.entries.push(c.data() as ChatEntry)
                })
                const ret = {
                    chatDialog: dialog
                } as ReturnObj
                return ret
            }).catch((error)=> {
            return {error: "NO-DIALOG", errorObj: error} as ReturnObj
            })
    }
}