// import {Request, Response, Router} from "express";
// import {db} from "../config/firebase"
// import {logger} from "firebase-functions";
//
// const addnew = function (req: Request, res: Response) {
//     const collection = db.collection(req.params.collectionid);
//     const object = req.body
//     collection.add(object).then((doc)=> {
//         res.json({collectionId: req.params.collection, objectid: doc.id})
//         logger.info("added new to collection", req.params.collectionid, doc.id)
//     }).catch((err)=>
//         res.json({collectionId: req.params.collectionid, error: err})
//     )
// }
//
// const update = async function (req: Request, res: Response) {
//
//     const collection = db.collection(req.params.collection);
//     const object = req.body
//     collection.doc(req.params.objectid).set(object).then((r)=> {
//         res.json({collectionId: req.params.collectionid, objectid: req.params.objectid, object: object, time: r.writeTime})
//         logger.info("added to collection",req.params.collection,req.params.objectid)
//     }).catch((e)=>
//         res.json({collectionId: req.params.collection, error: e})
//     )
// }
//
// const get = function (req: Request, res: Response) {
//     const collectioId = req.params.collection
//     const objectid = req.params.objectid
//     const object = {}
//     res.json({collectionId: collectioId, objectid: objectid, object: object})
//     logger.info("get from collection",collectioId, objectid)
// }
//
// const del = function (req: Request, res: Response) {
//     const collectioId = req.params.collection
//     const objectid = req.params.objectid
//     res.json({collectionId: collectioId, objectid: objectid})
//     logger.info("delete from collection",collectioId,objectid)
// }
//
// class GenericController {
//     router = Router();
//     constructor() {
//         this.router.put("/gen/:collectionid/add", addnew)
//         this.router.post("/gen/:collectionid/update/:objectid", update)
//         this.router.get("/gen/:collectionid/get/:objectid", get)
//         this.router.delete("/gen/:collectionid/delete/:objectid", del)
//     }
// }
// export default new GenericController().router