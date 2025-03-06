import firestore from "./firestore-db"
import {logger} from "firebase-functions";

const user: any = {
    email: "leif@auke.no",
    name: "leif auke",
    subscriptions: [
        {product: "product1", productname: "test name"},
        {product: "product2", productname: "test name2"},
        {product: "product3", productname: "test name3"}
    ]
}

export default class Test1 {
    constructor() {
        logger.info("test cons")
    }

    public async runTest() {
        logger.info("save user")
        // open users collection
        const userCollection = firestore.collection("users");
        // save user
        var res = await userCollection.doc("2").set(user)
        logger.info(res.writeTime)

        // read user
        const userRead = await userCollection.doc("2").get()
        console.log(userRead.data())

        // update subcollection (queries)
        const subscriptionRef = userCollection.doc("2").collection("queries")
        subscriptionRef.doc("1").set({quryname: "query name 1",description:"this is qury1"})
        subscriptionRef.doc("2").set({quryname: "query name 2",description:"this is qury2"})
        subscriptionRef.doc("3").set({quryname: "query name 2",description:"this is qury3"})
        logger.info("saved queries")

        // list all documents
        var data2 = await subscriptionRef.listDocuments()
        const queries = await Promise.all(
            data2.map(async (docref) => {
                const d = await docref.get()
                return d.data()
            })
        )
        console.log( queries)

    }
}
