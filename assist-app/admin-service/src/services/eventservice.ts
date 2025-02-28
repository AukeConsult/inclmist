import {Request, Response, Router} from "express";

class EventService {

  router = Router();
  constructor() {
    this.router.post("/save", this.saveUser)
    this.router.get("/read/:userid", this.readUser)
    this.router.delete("/delete/:userid", this.deleteUser)
  }
  readUser(req: Request, res: Response) {
    res.json({user: "asdasd"})
  }
  saveUser(req: Request, res: Response) {}
  deleteUser(req: Request, res: Response) {
    res.json("ok");
  }
}
export default new EventService().router;
