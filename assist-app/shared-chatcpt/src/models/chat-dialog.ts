import {QueryDescriptor} from "./query-descriptor";

// Individual chat dialogs
// in dialog have one user only and that is the user that perform the model ask and reply

// message sent to model
export interface ChatMessage {
    modelId: string;
    role?: string,
    content?: string,
    image?: object
    file?: object
    modelResult?: any
}

// message entry in dialog
// one message entry os one ask and reply to the model
export interface ChatEntry {
    // generated GUID to identify the message
    id?: string
    userId?: string
    queryId?: string
    profileId?: string
    dialogId?: string
    //
    counter?: number
    queryDescriptor?: QueryDescriptor;
    entry?: ChatMessage []
    replies?: ChatMessage []
    error?: string
    errorObject?: any
}

// the dialog with all messages in the dialog
export interface ChatDialog {
    id: string,
    // the owner of the dialog
    userId: string;
    // generated GUID to identify the dialog
    title: string,
    profileId?: string
    // full descriptor used in the dialog
    // same as pointed to the quryId
    queryId?: string
    queryDescriptor?: QueryDescriptor;
    entries: ChatEntry []
    history: ChatMessage []
}