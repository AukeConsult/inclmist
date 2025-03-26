import cors, {CorsOptions} from "cors";
import {QueryModels} from "./models/query-models";
import {app} from "firebase-admin";
import App = app.App;
import express, {Application} from "express";

export default class Server {

    constructor(app: Application, firebase: App) {
        this.config(app);
        const queryModels = new QueryModels(firebase.firestore())

        app.post("/entry", async function (req, res) {
            console.log(req.body)
            const chatEntry = req.body
            console.log(chatEntry)
            const ret = await queryModels.chatMessage(chatEntry)
            console.log(ret)
            res.json(ret)
        });

        app.get("/dialog/:did", function (req,res) {
            const did = req.params.did
            res.json({did: did})
        });

        app.get("/", function (req,res) {
            res.json({message: "hello"})
        });

    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "*"
        };

        app.use(cors(corsOptions))
        app.use(express.json({ limit: '50mb' }))
        app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

        app.all("/*", function(req, res, next){
            // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

}
