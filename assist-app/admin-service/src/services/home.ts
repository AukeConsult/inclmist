import {Request, Response, Router} from "express";

class Home {
  router = Router();
  constructor() {
    this.router.get("/", function (req: Request, res: Response) {
      res.json({ message: "Welcome to ai assistant" });
    });
  }
}
export default new Home().router;
