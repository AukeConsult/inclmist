import {fireBaseAdminKey, openAiApiKey} from "./secrets";
import {TrainModels} from "./services/train-models";
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
    trainModel(skipModel: boolean): TrainModels
}

const modelApp: ModelApp  = {
    appName: "AI-TEAM",
    modelAccount: {ventor: VendorEnum.chatGpt, openAiApiKey: openAiApiKey} as ModelAccount,
    fireBaseAdmin: admin.initializeApp({credential: admin.credential.cert(fireBaseAdminKey as ServiceAccount)},"test"),
    trainModel(skipModel: boolean) {
        return new TrainModels(this.fireBaseAdmin,this.modelAccount,skipModel)
    }
}
export default modelApp