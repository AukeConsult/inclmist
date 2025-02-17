import express, {Application, Request, Response} from "express";
import cors, { CorsOptions } from "cors";
import ApiRoutes from "./api-routes";

export default class Server {

    constructor(app: Application) {
        this.config(app);
        new ApiRoutes(app);
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

        app.get("/", (req: Request, res: Response) => {
            res.json({ message: "Welcome to the Express + TypeScript Server!" });
        });

    }
}
