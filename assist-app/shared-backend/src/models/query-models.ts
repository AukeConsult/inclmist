import {ChatMessage,ChatEntry} from "../shared-library";
import OpenAI from "openai";
import {firestore} from "firebase-admin";
import {appConfig} from "../config";
import Firestore = firestore.Firestore;
import {ChatStorage} from "../";

export class QueryModels {

    client = new OpenAI({
        apiKey: appConfig.openAiApiKey, // This is the default and can be omitted
        dangerouslyAllowBrowser: true
    });

    public storage: ChatStorage

    constructor(fireStore: Firestore) {
        this.storage = new ChatStorage(fireStore)
    }

    async chatMessage(chatEntry: ChatEntry)  {

        return this.storage.initEntry(chatEntry).then((entry)=> {

            // add history for context
            const messages: string | any[] = []

            if(entry.history) {
                // remove oldest history
                if(entry.history.length>3) {
                    entry.history = entry.history.slice(1)
                }
                for(var hm of entry.history) {
                    messages.push({
                        role: hm.role,
                        content: hm.content
                    })
                }
            }
            if(entry.entry) {
                for(var m of entry.entry) {
                    messages.push({
                        role: m.role,
                        content: m.content
                    })
                }
            }

            return this.client.chat.completions.create(
                {
                    model: 'gpt-4',
                    messages: messages,

                }).then((ret)=> {

                const result: ChatMessage[] = []
                for(var r of ret.choices) {
                    result.push({
                        modelId: 'gpt-4',
                        role: r.message.role,
                        content: r.message.content
                    } as ChatMessage)
                }
                entry.replies=result
                if(!entry.history) {
                    entry.history = []
                }
                entry.history.push(...result)
                return this.storage.storeChatEntry(entry).then((ret)=> ret)
            })
        })
    }

    async simpleMessage(message: string)  {
        const chatMessages: any | undefined [] = [
            {
                role: 'user',
                content: message
            }
        ]

        return this.client.chat.completions.create(
            {
                model: 'gpt-4',
                messages: [...chatMessages],
            }).then((ret)=> {

            const result: ChatMessage[] = []
            for(var r of ret.choices) {
                result.push({
                    modelId: 'gpt-4',
                    role: r.message.role,
                    content: r.message.content
                } as ChatMessage)
            }
            return {
                entry: chatMessages,
                replies: result
            } as ChatEntry

            }).catch((err)=> {
                return {
                    error: "CHAT_ERROR",
                    errorObject: err
                } as ChatEntry

            })
    }

}
