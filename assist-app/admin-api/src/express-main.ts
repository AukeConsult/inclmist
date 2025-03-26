import express from "express";
import cors from "cors";

const expressMain = express();

expressMain.use(cors());
expressMain.use(express.json({ limit: '50mb' }))
expressMain.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
//app.use("/crud", crudRoute);

expressMain.use("/", (req, res) => {
    res.json({message: "welcome, paths avail: /users /auth"})
});

export default expressMain;
