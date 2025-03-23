import {fireBaseAdminKey, firebaseConfig, openAiApiKey} from "../secrets";
import {TrainModels} from "./services/train-models";
import {ServiceAccount} from "firebase-admin/lib/app/credential";
import {app} from "firebase-admin";
import App = app.App;

import {
    ModelAccount,
    VendorEnum
} from "shared-library";
import { QueryModels } from "./models/query-models";

export interface AppConfig {
    defaultModel: string,
    openAiApiKey: string
    fireBaseServiceAccountKey: ServiceAccount
    firebaseClientConfig: any
}

export const appConfig: AppConfig = {
    defaultModel: "gpt-4",
    openAiApiKey: openAiApiKey,
    fireBaseServiceAccountKey: fireBaseAdminKey as ServiceAccount,
    firebaseClientConfig: firebaseConfig
}

export interface BackendApp {
    appName: string
    modelAccount: ModelAccount,
    queryModels: QueryModels,
    trainModels(fireBaseAdmin: App, skipModel: boolean): TrainModels,
}

const backendApp: BackendApp  = {
    appName: "AI-TEAM",
    modelAccount: {ventor: VendorEnum.chatGpt, openAiApiKey: appConfig.openAiApiKey} as ModelAccount,
    queryModels: new QueryModels(),
    trainModels(fireBaseAdmin,skipModel: boolean) {
        return new TrainModels(fireBaseAdmin,this.modelAccount,skipModel)
    },
}

export default backendApp