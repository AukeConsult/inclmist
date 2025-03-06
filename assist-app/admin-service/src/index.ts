import express from "express";
import {onRequest} from "firebase-functions/v2/https";
import cors from "cors";
import {CorsOptions} from "cors";
import homeRoutes from "./home";
import userDb from "./user-db";
import Test1 from "./firestore-test";

const app = express();
var firestoreTest = new Test1()

const corsOptions: CorsOptions = {
    origin: "*"
};

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use("/", homeRoutes);
app.use("/", userDb);

firestoreTest.runTest()

exports.admin = onRequest(app)


