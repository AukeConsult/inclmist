import {firebaseConfig, openAiApiKey} from "./secrets";
import {fireBaseAdminKey} from "./secrets";
import {ServiceAccount} from "firebase-admin";

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
