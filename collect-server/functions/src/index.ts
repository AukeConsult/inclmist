/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/lib/logger";
import * as admin from 'firebase-admin'

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");

admin.initializeApp();

export const helloinclmist = onRequest((request: Request, response: Response) => {
  logger.info("Hello helloinclmist!", {structuredData: true});
});

exports.readNavData = onSchedule("every 5 minutes", async (event) => {

  logger.info('Navread will be run every 5 minutes!');

  try {
    const data = {
      test: "test",
      lastUpdate: ""
    }
    await admin.storage().bucket("collect-server.firebasestorage.app").file("navndata.json").save(JSON.stringify(data));

  } catch(err) {
    logger.error(err)
  }

});


