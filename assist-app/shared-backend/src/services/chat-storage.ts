import {ChatDialog, ChatEntry, ChatMessage} from "shared-library/src/models/chat-dialog";
import {
    AppUser,
    QueryDescriptor,
    ReturnObj,
    ProfileAdminUser,
    ProfileAdminUsers, AppUserWork
} from "shared-library";
import {app, firestore} from "firebase-admin";

export class ChatStorage {

    private db: firestore.Firestore
    private userCollection
    private profilesCollection

    constructor(firebaseApp: app.App) {
        this.db = firebaseApp.firestore()
        this.userCollection = this.db.collection("users-work")
        this.profilesCollection = this.db.collection("profiles-work")
    }

    public async storeChatEntry(chatEntry: ChatEntry, results: ChatMessage[]) {

        if(await this.initEntry(chatEntry)) {

            if(chatEntry.uid && chatEntry.did && chatEntry.pid) {

                chatEntry.timeStamp = Date.now()
                chatEntry.replies = results
                const dialogRef
                    = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc(chatEntry.did)

                const entryRef = dialogRef.collection("entries").doc()
                await entryRef.set(chatEntry)
                dialogRef.update({
                    queryId: chatEntry.qid,
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

        if (!chatEntry.uid) {
            const doc = this.userCollection.doc()
            await doc.set(
                {
                    role: 'profileOwner',
                    nameRef: "dummy"
                } as unknown as AppUserWork
            )
            chatEntry.uid = doc.id
            await this.userCollection.doc(doc.id).update({userId: doc.id})
        }
        if(!(await this.userCollection.doc(chatEntry.uid).get()).exists) {
            this.userCollection.doc(chatEntry.uid).set({active: false, userName: "dummy user"})
        }

        var profileRef = this.profilesCollection.doc()
        if(chatEntry.pid) {
            profileRef = this.profilesCollection.doc(chatEntry.pid)
        }

        if (!chatEntry.pid || !(await profileRef.get()).exists) {

            const profile = {
                public: false,
                profileName: chatEntry.uid,
                ownerName: chatEntry.uid,
                uid: chatEntry.uid,
                pictures: [],
                links: [],
                adminUsers: {
                    canUpdate: true,
                    users:
                        [
                            {userId: chatEntry.uid, role: "admin", name: "no name"}
                        ] as ProfileAdminUser[]
                    } as ProfileAdminUsers
                }

            await profileRef.set(profile)
            chatEntry.pid = profileRef.id
            await this.userCollection.doc(chatEntry.uid).collection("profileRefs")
                .doc(chatEntry.pid).set({
                    pid: chatEntry.pid,
                    name: profile.profileName
                })

        }

        if(chatEntry.queryDescriptor && chatEntry.pid) {

            const profileRef = this.profilesCollection.doc(chatEntry.pid)
            const queryCollection = profileRef.collection("trainQueries")

            if(!chatEntry.qid) {
                const queryRef = queryCollection.doc()
                await queryRef.set(chatEntry.queryDescriptor)
                chatEntry.qid = queryRef.id
            } else {
                const queryRef = queryCollection.doc(chatEntry.qid)
                await queryRef.set(chatEntry.queryDescriptor)
            }

        }

        if (!chatEntry.did && chatEntry.entry) {

            const title = chatEntry.entry[0].content
            const dialog = {
                uid: chatEntry.uid,
                title: title,
                qid: chatEntry.qid,
                pid: chatEntry.pid
            } as ChatDialog

            const dialogRef
                = this.userCollection.doc(chatEntry.uid).collection("dialogs").doc()
            await dialogRef.set(dialog)
            chatEntry.did = dialogRef.id

        }

        if (chatEntry.did) {
            return (await this.userCollection.doc(chatEntry.uid).collection("dialogs").doc(chatEntry.did).get()).exists
        } else {
            return false
        }
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
        if(chatEntry.pid && chatEntry.qid) {
            return {...(await this.profilesCollection.doc(chatEntry.pid).collection("queries").doc(chatEntry.qid).get()).data()} as QueryDescriptor
        } else {
            return undefined
        }
    }

    public async readDialog(dialogRef: {uid: string, did: string}) : Promise<ReturnObj> {
        const dialogs = this.userCollection.doc(dialogRef.uid).collection("dialogs")
        return dialogs.doc(dialogRef.uid).get()
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