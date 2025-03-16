import {ChatDialog, ChatEntry, ChatMessage} from "shared-library/src/models/chat-dialog";
import {
    AppUser,
    QueryDescriptor,
    ReturnObj,
    ProfileAdminUser,
    ProfileAdminUsers
} from "shared-library";
import {app, firestore} from "firebase-admin";

export class ChatStorage {

    private db: firestore.Firestore
    private userCollection
    private profilesCollection

    constructor(firebaseApp: app.App) {
        this.db = firebaseApp.firestore()
        this.userCollection = this.db.collection("users-test")
        this.profilesCollection = this.db.collection("profiles-test")
    }

    public async storeChatEntry(chatEntry: ChatEntry, results: ChatMessage[]) {

        if(await this.initEntry(chatEntry)) {

            if(chatEntry.userId && chatEntry.dialogId && chatEntry.profileId) {

                chatEntry.timeStamp = Date.now()
                chatEntry.replies = results
                const dialogRef
                    = this.userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId)

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
    async initEntry(chatEntry: ChatEntry)  {

        if (!chatEntry.userId) {
            const doc = this.userCollection.doc()
            await doc.set(
                {
                    role: "profileOwner",
                    displayName: "dummy",
                    email: "x@xx.no"
                } as AppUser
            )
            chatEntry.userId = doc.id
            await this.userCollection.doc(doc.id).update({userId: doc.id})
        }
        if(!(await this.userCollection.doc(chatEntry.userId).get()).exists) {
            this.userCollection.doc(chatEntry.userId).set({active: false, userName: "dummy user"})
        }

        var profileRef = this.profilesCollection.doc()
        if(chatEntry.profileId) {
            profileRef = this.profilesCollection.doc(chatEntry.profileId)
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
            await this.userCollection.doc(chatEntry.userId).collection("profileRefs")
                .doc(chatEntry.profileId).set({
                    profileId: chatEntry.profileId,
                    name: profile.profileName
                })

        }

        if(chatEntry.queryDescriptor && chatEntry.profileId) {

            const profileRef = this.profilesCollection.doc(chatEntry.profileId)
            const queryCollection = profileRef.collection("trainQueries")

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
                = this.userCollection.doc(chatEntry.userId).collection("dialogs").doc()
            await dialogRef.set(dialog)
            chatEntry.dialogId = dialogRef.id

        }

        if (chatEntry.dialogId) {
            return (await this.userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId).get()).exists
        } else {
            return false
        }
    }

    async getDialog(chatEntry: ChatEntry) {
        if(chatEntry.userId && chatEntry.dialogId) {
            const col = this.userCollection.doc(chatEntry.userId).collection("dialogs").doc(chatEntry.dialogId)
            return {...(await col.get()).data()} as ChatDialog
        } else {
            return undefined
        }
    }

    async getQueryDecription(chatEntry: ChatEntry) : Promise<QueryDescriptor | undefined>  {
        if(chatEntry.profileId && chatEntry.queryId) {
            return {...(await this.profilesCollection.doc(chatEntry.profileId).collection("queries").doc(chatEntry.queryId).get()).data()} as QueryDescriptor
        } else {
            return undefined
        }
    }

    public async readDialog(dialogRef: {userId: string, dialogId: string}) : Promise<ReturnObj> {
        const dialogs = this.userCollection.doc(dialogRef.userId).collection("dialogs")
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