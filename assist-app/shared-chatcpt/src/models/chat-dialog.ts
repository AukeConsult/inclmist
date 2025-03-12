import {QueryDescriptor} from "./query-descriptor";

export interface ChatMessage {
    role?: string,
    message: string,
}

export interface ChatEntry {
    profileId?: string
    queryId: string
    id?: string
    dialogId?: string
    counter?: number
    ask: ChatMessage,
    reply: ChatMessage
    history: ChatMessage[]
}

export interface ChatDialog {
    id: string,
    name: string,
    userId?: string;
    queryDescriptor: QueryDescriptor;
    entries: ChatEntry []
}