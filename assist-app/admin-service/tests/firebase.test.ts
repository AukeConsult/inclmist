import * as admin from "firebase-admin"
import { fireBaseAdminKey } from "../src/secrets";
import { ServiceAccount } from "firebase-admin/lib/app/credential";
import { AppUser } from "shared-library";

admin.initializeApp({credential: admin.credential.cert(fireBaseAdminKey as ServiceAccount)})

describe('logon firebase', () => {

    it('connect to firebase', async () => {
        const db = admin.firestore()
        await db.listCollections()
        const docRef = db.collection("test").doc()
        await docRef.set({})
        console.log(docRef.id)
        docRef.delete()
    })

    it('partial update firebase', async () => {
        const db = admin.firestore()
        const docRef = db.collection("test").doc("partial4")
        const doc = await docRef.get()
        if(doc.exists) {
            await docRef.update({
                updated: Date.now()
            })
        } else {
            await docRef.set({
                name: "hello",
                address: "solsvingen"
            })
        }
        console.log(docRef.id)
        await docRef.update({
            postaddress: 3034
        })

    })

    it('update sub collections', async () => {

        const db = admin.firestore()
        await db.listCollections()

        const docRef = db.collection("test").doc("partial5")
        const doc = await docRef.get()
        if (doc.exists) {
            await docRef.update({
                updated: Date.now()
            })
        } else {
            await docRef.set({
                name: "partial2",
                address: "solsvingen"
            })
        }
        console.log(docRef.id)
        for (let i = 1; i < 10; i++) {
            const subRef = docRef.collection("sub").doc(i.toString())
            subRef.set({
                order: i + 10,
                customerId: i * 10
            })
        }
        await docRef.update({
            postaddress: 4000
        })
    })

});

