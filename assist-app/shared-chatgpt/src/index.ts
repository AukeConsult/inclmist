import {fireBaseAdminKey, openAiApiKey} from "./secrets";
import {AskModels} from "./services/ask-models";
import {ServiceAccount} from "firebase-admin/lib/app/credential";
import * as admin from "firebase-admin";
import {app} from "firebase-admin";
import App = app.App;

import {
    ModelAccount,
    VendorEnum
} from "shared-library";

export interface ModelApp {
    appName: string
    modelAccount: ModelAccount,
    fireBaseAdmin: App,
    askModel(): AskModels
}

const modelApp: ModelApp  = {
    appName: "AI-TEAM",
    modelAccount: {ventor: VendorEnum.chatGpt, openAiApiKey: openAiApiKey} as ModelAccount,
    fireBaseAdmin: admin.initializeApp({credential: admin.credential.cert(fireBaseAdminKey as ServiceAccount)},"test"),
    askModel() {
        return new AskModels(this.fireBaseAdmin,this.modelAccount)
    }
}
export default modelApp