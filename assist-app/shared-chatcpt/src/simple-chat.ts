import {ChatEntry} from "./models/chat-dialog";
import {ChatStorage} from "./chat-storage";

export class SimpleChat {

    constructor(private storeage: ChatStorage) {}
    private askModel(userId:string, message: ChatEntry ) : ChatEntry {

        if(!message.history) {
            message.history = []
        }

        message.ask.role = "user"
        // read query spec
        // read model
        message.reply = {
            role: "assistant",
            message: message.ask.message + " this is the answer"
        }

        //
        message.history.push(message.ask)
        message.history.push(message.reply)

        this.storeage.saveMessage(userId,message)
        return message;
    }
    async sendMessage(userId:string, message: ChatEntry) : Promise<ChatEntry> {
        return this.askModel(userId, message)
    }

}

