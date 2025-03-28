import {VendorEnum} from "./enum-types";

export interface ModelAccount {
    vendor: VendorEnum | string
    openAiApiKey: string
}