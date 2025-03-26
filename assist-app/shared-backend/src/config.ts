import {firebaseConfig, openAiApiKey} from "../secrets";
import {fireBaseAdminKey} from "./secrets";
import {ServiceAccount} from "firebase-admin/lib/app/credential";

// import {
//     ModelAccount,
//     VendorEnum
// } from "shared-library";
// import { QueryModels } from "./models/query-models";
//
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
//
// export interface BackendApp {
//     appName: string
//     modelAccount: ModelAccount,
//     queryModels(): QueryModels,
//     trainModels(skipModel: boolean): TrainModels,
// }
//
// export const firebaseApp = admin.initializeApp({credential: admin.credential.cert(appConfig.fireBaseServiceAccountKey)});
//
// const backendApp: BackendApp  = {
//     appName: "AI-TEAM",
//     modelAccount: {ventor: VendorEnum.chatGpt, openAiApiKey: appConfig.openAiApiKey} as ModelAccount,
//     queryModels() {
//         return new QueryModels(firebaseApp.firestore())
//     },
//     trainModels(skipModel: boolean) {
//         return new TrainModels(firebaseApp.firestore(),this.modelAccount,skipModel)
//     },
// }
// export default backendApp