import {QueryDescriptor} from "./query-descriptor";

// Individual chat dialogs
// in dialog have one user only and that is the user that perform the model ask and reply

// message sent to model
export interface ChatMessage {
    // role of message
    role: string,
    content: string,
    image?: object
    file?: object
}

// message entry in dialog
// one message entry os one ask and reply to the model
export interface ChatEntry {
    // generated GUID to identify the message
    id?: string
    // used as parameter in the chat
    queryId?: string
    profileId?: string
    dialogId?: string
    //
    counter?: number
    entry: ChatMessage
    modelResult?: any
    error?: string
    errorObject?: any
}

// the dialog with all messages in the dialog
export interface ChatDialog {
    id: string,
    // the owner of the dialog
    userId: string;
    // generated GUID to identify the dialog
    description: string,
    queryId?: string
    profileId?: string
    // full descriptor used in the dialog
    // same as pointed to the quryId
    queryDescriptor?: QueryDescriptor;
    entries: ChatEntry []
    history: ChatMessage[]

}