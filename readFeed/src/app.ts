import express, { Request, Response } from "express";
import Server from "./server";

const app = express();
const port = process.env.PORT || 3000;
new Server(app);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

