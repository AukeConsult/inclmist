import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
//import crudRoute from "./controllers/generic.controller"

const expressMain = express();

expressMain.use(cors());
expressMain.use(express.json({ limit: '50mb' }))
expressMain.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
expressMain.use("/users", usersRoutes);
expressMain.use("/auth", authRoutes);
//app.use("/crud", crudRoute);

expressMain.use("/", (req, res) => {
    res.json({message: "welcome, paths avail: /users /auth"})
});

export default expressMain;
