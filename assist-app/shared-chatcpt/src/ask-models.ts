import {ChatDialog, ChatEntry, ChatMessage} from "./models/chat-dialog";
import {ChatStorage} from "./services/chat-storage";
import {QueryDescriptor, QueryParameters} from "./models/query-descriptor";
import OpenAI from "openai";

import {openAiApiKey} from "./secrets"

const client = new OpenAI({
    apiKey: openAiApiKey, // This is the default and can be omitted
});

//
async function doChatCompletion(
    chatDialog: ChatDialog,
    parameters: QueryParameters,
    chatEntry: ChatEntry) {

    const results: ChatMessage[] = []
    // read model
    const chatMessages: any | undefined [] = [
        {
            role: "developer",
            content: parameters.instructions
        }
    ]
    if(chatDialog) {

        var x = chatDialog.history.filter((f) =>
            f.modelId===parameters.modelId
        ).map((f)=> {return {
            role: f.role,
            content: f.content
        }})
        chatMessages.push(...x)
    }
    if(chatEntry.entry) {
        chatEntry.entry.forEach((entry)=> {
            chatMessages.push(
                {
                    role: "user",
                    content: entry.content
                }
            )
            console.log("input", entry.content)
        })
    }
    const ret = await client.chat.completions.create(
        {
            model: parameters.modelId,
            messages: [...chatMessages],
            user: chatEntry.userId
        })

    for(var r in ret.choices) {
        results.push({
            modelId: parameters.modelId,
            role: ret.choices[r].message.role,
            content: ret.choices[r].message.content
        } as ChatMessage)
    }
    // set history based on parameter
    // used for next call
    chatDialog.history.push(...results)
    return results

}

export class AskModels {

    constructor(private storeage: ChatStorage) {}

    private async processQuestion(userId:string, chatEntry: ChatEntry ) : Promise<any> {

        const chatDialog = this.storeage.getDialog(chatEntry)
        let queryDescriptor: QueryDescriptor | undefined

        if(chatEntry.queryDescriptor) {
            queryDescriptor=chatEntry.queryDescriptor;
        } else if(chatEntry.queryId) {
            queryDescriptor = this.storeage.getQueryDecription(chatEntry.queryId,chatEntry.profileId)
        }
        if(queryDescriptor && chatDialog) {

            chatEntry.userId=userId

            const results: ChatMessage[] = []

            // only add latest
            if(chatDialog.history) {
                const newhistory = []
                newhistory.push(...chatDialog.history)
                chatDialog.history = newhistory
            }
            for (const parameter of queryDescriptor.queryParameters) {

                // read model
                const results_query = await doChatCompletion(
                    chatDialog,
                    parameter,
                    chatEntry
                )
                results.push(...results_query)
            }
            return this.storeage.storeChatEntry(userId, chatEntry, results)

        } else {
            return {error: "NO-SPECIFICATION"} as ChatEntry
        }
    }

    async askQuestion(userId:string, message: ChatEntry)  {
        return this.processQuestion(userId, message)
    }

}

