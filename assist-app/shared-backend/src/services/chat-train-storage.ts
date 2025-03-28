import {
    QueryDescriptor,
    ProfileWork,
    ChatDialog, ChatEntry, ChatMessage
} from "../";

import {firestore} from "firebase-admin";

const collnames = {
    userWork: "usersWork",
    profiles: "profiles",
    profilesWork: "profilesWork",
    trainQueries: "trainQueries",
    trainDialogs: "trainDialogs",
    userProfileRefs: "trainProfiles",
    chatEntries: "entries",
    dialogs: "dialogs"
}

export class ChatTrainStorage {

    private userCollection
    private profilesCollection

    constructor(db: firestore.Firestore) {
        this.userCollection = db.collection(collnames.userWork)
        this.profilesCollection = db.collection(collnames.profilesWork)
    }

    public async storeChatEntry(chatEntry: ChatEntry, results: ChatMessage[]) {

        await this.initEntry(chatEntry)
        if(chatEntry.uid && chatEntry.did && chatEntry.pid) {

            // store to profiles
            chatEntry.timeStamp = Date.now()
            chatEntry.replies = results

            const dialogRef =
                this.profilesCollection.doc(chatEntry.pid).collection(collnames.trainDialogs).doc(chatEntry.did)

            const entryRef = dialogRef.collection(collnames.chatEntries).doc()
            await entryRef.set(chatEntry)

            dialogRef.update({
                qid: chatEntry.qid,
                queryDescriptor: chatEntry.queryDescriptor,
                timeStamp: chatEntry.timeStamp
            })

            // store to user
            const userDialogRef =
                this.userCollection.doc(chatEntry.uid).collection(collnames.dialogs).doc(chatEntry.did)

            userDialogRef.update({
                qid: chatEntry.qid,
                timeStamp: chatEntry.timeStamp
            })

            const userEntryRef = userDialogRef.collection(collnames.chatEntries).doc()
            await userEntryRef.set({
                entry: chatEntry.entry,
                replies: chatEntry.replies,
                timeStamp: chatEntry.timeStamp
            })

        } else {
            throw new Error("NO-DIALOG");
        }
        return chatEntry

    }
    async initEntry(chatEntry: ChatEntry)  {

        var userRef = this.userCollection.doc()
        if(chatEntry.uid) {
            userRef = this.userCollection.doc(chatEntry.uid)
        }
        if (!chatEntry.uid || !(await userRef.get()).exists) {

            await userRef.set({role: 'profileOwner'})
            chatEntry.uid = userRef.id
            userRef = this.userCollection.doc(chatEntry.uid)
            await userRef.update({uid: userRef.id, nameRef: "dummy-" + chatEntry.uid})

        }

        var profileRef = this.profilesCollection.doc()
        if(chatEntry.pid) {
            profileRef = this.profilesCollection.doc(chatEntry.pid)
        }
        var profileWork = (await profileRef.get()).data() as ProfileWork
        if (!chatEntry.pid || !(await profileRef.get()).exists) {

            await profileRef.set({
                uid: chatEntry.uid
            })

            profileRef = this.profilesCollection.doc(profileRef.id)
            await profileRef.update({
                pid: profileRef.id,
                nameRef: "dummy-" + profileRef.id + "-" + Date.now()
            })
            chatEntry.pid = profileRef.id
            profileWork = (await profileRef.get()).data() as ProfileWork

            // update profile entry


        }

        if (profileWork) {
            await this.userCollection.doc(chatEntry.uid).collection(collnames.userProfileRefs)
                .doc(chatEntry.pid).set({
                    pid: chatEntry.pid,
                    name: profileWork.nameRef,
                    active: false,
                    underWork: true
                })
        }

        if(chatEntry.queryDescriptor && chatEntry.pid) {

            chatEntry.queryDescriptor.pid = chatEntry.pid
            const queryCollection = profileRef.collection(collnames.trainQueries)
            if(!chatEntry.qid) {
                const queryRef = queryCollection.doc()
                await queryRef.set(chatEntry.queryDescriptor)
                chatEntry.qid = queryRef.id
            } else {
                const queryRef = queryCollection.doc(chatEntry.qid)
                await queryRef.set(chatEntry.queryDescriptor)
            }
        }

        if (chatEntry.pid && !chatEntry.did && chatEntry.entry) {

            const dialog = {
                uid: chatEntry.uid,
                title: chatEntry.entry[0].content + " " + Date.now() + "-" + chatEntry.uid,
                qid: chatEntry.qid,
                pid: chatEntry.pid

            } as ChatDialog

            const dialogRef
                = this.profilesCollection.doc(chatEntry.pid).collection(collnames.trainDialogs).doc()
            await dialogRef.set(dialog)
            chatEntry.did = dialogRef.id

            const userDialogRef = userRef.collection(collnames.dialogs).doc(chatEntry.did)
            await userDialogRef.set(dialog)

        }
    }

    async getDialog(chatEntry: ChatEntry) {
        if(chatEntry.pid && chatEntry.did) {
            const col = this.profilesCollection.doc(chatEntry.pid).collection(collnames.trainDialogs).doc(chatEntry.did)
            return {...(await col.get()).data()} as ChatDialog
        } else {
            return undefined
        }
    }

    async getQueryDecription(chatEntry: ChatEntry) : Promise<QueryDescriptor | undefined>  {
        if(chatEntry.pid && chatEntry.qid) {
            return {...(await this.profilesCollection.doc(chatEntry.pid).collection(collnames.trainQueries).doc(chatEntry.qid).get()).data()} as QueryDescriptor
        } else {
            return chatEntry.queryDescriptor
        }
    }

    public async readDialog(dialogRef: {pid: string, did: string}) : Promise<ChatDialog> {
        const dialogs = this.profilesCollection.doc(dialogRef.pid).collection(collnames.trainDialogs)
        return dialogs.doc(dialogRef.did).get()
            .then(async (r)=> {
                try {
                    const snap = await r.ref.collection(collnames.chatEntries).get()
                    const dialog = r.data() as ChatDialog
                    dialog.entries = []
                    snap.forEach((c)=> {
                        dialog.entries.push(c.data() as ChatEntry)
                    })
                    return dialog
                } catch (error) {
                    throw error
                }
            }).catch((error)=> {
                throw error
            })
    }
}