import { onRequest } from "firebase-functions/v2/https";
import app from "../main";

exports.api = onRequest(app);
