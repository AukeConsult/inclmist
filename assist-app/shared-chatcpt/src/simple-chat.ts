import chatStorage from "./index"
import {ChatEntry} from "./models/chat-dialog";
import {ChatStorage} from "./chat-storage";

export class SimpleChat {

    constructor(private chatStorage: ChatStorage) {}
    private askModel(userId:string, message: ChatEntry ) : ChatEntry {
        chatStorage.saveMessage(userId,message)
        return message;
    }
    sendMessage(userId:string, message: ChatEntry) : ChatEntry {
        return this.askModel(userId, message)
    }

}

