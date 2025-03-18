import { credential, initializeApp } from "firebase-admin"
import { fireBaseAdminKey } from "shared-backend/secrets";
import { ServiceAccount } from "firebase-admin/lib/app/credential";

import * as admin from "firebase-admin";

const app = admin.initializeApp({credential: credential.cert(fireBaseAdminKey as ServiceAccount)})

describe('function firebase', () => {

    it('connect to firebase', async () => {

    })


});


