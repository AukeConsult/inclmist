import {ChatEntry} from "./models/chat-dialog";
import {ChatStorage} from "./chat-storage";
import {openAiApiKey} from "./secrets"

export class SimpleChat {
    private chatApiUrl = 'https://api.openai.com/v1/chat/completions';
    //private imageApiUrl = 'https://api.openai.com/v1/images/generations';

    constructor(private storeage: ChatStorage) {}
    private async askModel(userId:string, chatEntry: ChatEntry ) : Promise<any> {

        chatEntry.entry.role = "user"
        const chatReply = this.storeage.storeChatEntry(userId,chatEntry)
        if(chatReply) {
            // read query spec
            const queryDescriptor = this.storeage.getQueryDecription(chatEntry.queryId,chatEntry.profileId)
            if(queryDescriptor && queryDescriptor.queryChatGpt) {

                // read model
                const body = {
                    model: queryDescriptor.queryChatGpt.modelId,
                    messages: [
                        {
                            role: "system",
                            content: queryDescriptor.queryChatGpt.instructions
                        },
                        {
                            role: chatEntry.entry.role,
                            content: chatEntry.entry.content
                        }
                    ]
                }
                const ret = await fetch(this.chatApiUrl, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + openAiApiKey
                    },
                    body: JSON.stringify(body)
                })
                const result = await ret.json()
                chatReply.entry = {
                    role: result.choices[0].message.role,
                    content: result.choices[0].message.content
                }
                result.choices = undefined
                chatReply.modelResult = result
                this.storeage.storeChatEntry(userId, chatReply)
                return chatReply;

            } else {
                chatReply.error = "missingSpecification"
                return chatReply
            }
        } else {
            chatEntry.error = "missingSpecification"
            return chatEntry
        }
    }
    async sendMessage(userId:string, message: ChatEntry)  {
        return this.askModel(userId, message)
    }

}

