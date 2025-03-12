import {QueryDescriptor} from "./query-descriptor";

// Individual chat dialogs
// in dialog have one user only and that is the user that perform the model ask and reply

// message sent to model
export interface ChatMessage {
    // role of message
    role: string,
    message: string,
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
    dialogId?: string
    profileId?: string
    //
    counter?: number
    ask: ChatMessage,
    reply: ChatMessage
    history: ChatMessage[]
}

// the dialog with all messages in the dialog
export interface ChatDialog {
    id: string,
    // the owner of the dialog
    userId: string;
    // generated GUID to identify the dialog
    description: string,
    queryId?: string
    // full descriptor used in the dialog
    // same as pointed to the quryId
    queryDescriptor?: QueryDescriptor;
    entries: ChatEntry []
}