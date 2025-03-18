import {ChatMessage} from "shared-library";
import OpenAI from "openai";
import {appConfig} from "../index";
import {ChatEntry} from "shared-library"


export class QueryModels {

    client = new OpenAI({
        apiKey: appConfig.openAiApiKey, // This is the default and can be omitted
        dangerouslyAllowBrowser: true
    });

    constructor() {}

    async chatMessage(chatEntry: ChatEntry)  {

        // add history for context
        const messages: string | any[] = []

        if(chatEntry.history) {
            // remove oldest history
            if(chatEntry.history.length>3) {
                chatEntry.history = chatEntry.history.slice(1)
            }
            for(var hm of chatEntry.history) {
                console.log(hm)
                messages.push({
                    role: hm.role,
                    content: hm.content
                })
            }
        }
        if(chatEntry.entry) {
            for(var m of chatEntry.entry) {
                messages.push({
                    role: m.role,
                    content: m.content
                })
            }
        }

        if(messages.length === 0) return chatEntry

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
                chatEntry.replies=result
                if(!chatEntry.history) {
                    chatEntry.history = []
                }
                chatEntry.history.push(...result)
                return chatEntry

            }).catch((err)=> {
                console.log(err)
                return {
                    error: "CHAT_ERROR",
                    errorObject: err
                } as ChatEntry
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
