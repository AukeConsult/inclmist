// Entities for dont chat dialog with a model

import {QueryDescriptor} from "./query-descriptor";
import {ModelEnum, MsgTypeEnum} from "./enum-types";

// message sent to and from a model
export interface ChatMessage {
    modelId: ModelEnum;
    role?: MsgTypeEnum | string,
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
    // ref to User
    userId?: string
    //ref to current dialog, use when send messages
    dialogId?: string
    // ref to QuerySpecification, used
    queryId?: string
    // ref to profile, used when dialog not exists
    profileId?: string

    timeStamp: number
    // full QuerySpecification added to message while training
    // use to store shanged in QuerySpecification
    queryDescriptor?: QueryDescriptor;
    // message to send to model
    entry?: ChatMessage []
    // answers from model
    replies?: ChatMessage []

    // last errors
    error?: string
    errorObject?: any
}

// the dialog with all messages in the dialog
export interface ChatDialog {
    id?: string

    // the owner of the dialog
    userId: string;

    // generated GUID to identify the dialog
    title: string,

    // reference to profile
    profileId?: string

    // refenrence to QuerySpecification
    queryId?: string

    // full QuerySpecification added to dialog while training
    queryDescriptor?: QueryDescriptor;

    // all messages in the dialog
    entries: ChatEntry []

    // last history used to send to model as question context
    // a limited amount can be sent, so only last hsitory is stored
    history: ChatMessage []

}

