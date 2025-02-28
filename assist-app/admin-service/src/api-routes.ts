import {Application} from "express";
import homeRoutes from "./services/home";

export default class ApiRoutes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
  }
}
