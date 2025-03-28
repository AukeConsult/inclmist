import {appConfig} from "../src/config";
import {firestore} from "firebase-admin";
import * as firebase from "firebase-admin"
firebase.initializeApp({credential: firebase.credential.cert(appConfig.fireBaseServiceAccountKey)});

describe('logon firebase', () => {

    it('connect to firebase', async () => {
        const db = firestore()
        await db.listCollections()
        const docRef = db.collection("test").doc()
        await docRef.set({})
        console.log(docRef.id)
        docRef.delete()
    },1000*300)

    it('partial update firebase', async () => {
        const db = firestore()
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

    },1000*300)

    it('update sub collections', async () => {

        const db = firestore()
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
    },1000*300)

});



