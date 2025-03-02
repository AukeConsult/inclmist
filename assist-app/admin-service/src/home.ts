import {Request, Response, Router} from "express";
import * as logger from "firebase-functions/logger"

interface userType {
  userid: string, name: string
}

const users: userType[] = [
  { userid: "1",
    name: "peter"
  },
  { userid: "2",
    name: "Leif"
  },
  { userid: "3",
    name: "Moez"
  },
  { userid: "4",
    name: "Ram"
  }
]

const info = function (req: Request, res: Response) {
  res.json({
    message: "Welcome to ai assistant service",
    apicalls: [
      {
        call: "/users",
        description: "get a list of users"
      },
      {
        call: "/user/{userid}",
        description: "get user"
      }
    ]
  })

}
const usersList = function (req: Request, res: Response) {
  res.json(users)
}
const userGet = function (req: Request, res: Response) {
  let ident = req.params.id;
  logger.info(ident)
  users.forEach((u: userType) => {
    logger.info(u)
    if (u.userid === ident) {
      res.json(u)
    }
  });
}

class Home {
  router = Router();
  constructor() {
    this.router.get("/users", usersList)
    this.router.get("/user/:id", userGet)
    this.router.get("/", info);
  }
}
export default new Home().router;
