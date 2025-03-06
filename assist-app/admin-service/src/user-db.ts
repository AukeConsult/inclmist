import {Router} from "express";

class UserDb {
    router = Router();
    constructor() {
        this.router.get("/db/user", function (req, res) {

        })
    }
}
export default new UserDb().router;