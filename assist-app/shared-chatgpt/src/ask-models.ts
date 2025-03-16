import {ChatDialog, ChatEntry, ChatMessage} from "./models/chat-dialog";
import {ChatStorage} from "./services/chat-storage";
import {QueryDescriptor, QueryParameters} from "./models/query-descriptor";
import OpenAI from "openai";
import {openAiApiKey} from "./secrets"



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
    const client = new OpenAI({
        apiKey: openAiApiKey, // This is the default and can be omitted
    });
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

    public simulate: boolean = true
    constructor(private storeage: ChatStorage) {}

    private async processQuestion(chatEntry: ChatEntry ) : Promise<any> {

        if(await this.storeage.initEntry(chatEntry)) {
            const chatDialog = await this.storeage.getDialog(chatEntry)
            const queryDescriptor = await this.storeage.getQueryDecription(chatEntry)
            if(queryDescriptor && chatDialog) {

                const results: ChatMessage[] = []

                // only add latest
                if(chatDialog.history) {
                    const newhistory = []
                    newhistory.push(...chatDialog.history)
                    chatDialog.history = newhistory
                }
                for (const parameter of queryDescriptor.queryParameters) {

                    if(!this.simulate) {
                        // read model
                        const results_query = await doChatCompletion(
                            chatDialog,
                            parameter,
                            chatEntry
                        )
                        results.push(...results_query)
                    }
                }
                return this.storeage.storeChatEntry(chatEntry, results)

            } else {
                return {error: "NO-SPECIFICATION"} as ChatEntry
            }

        }
    }

    async askQuestion(message: ChatEntry)  {
        return this.processQuestion(message)
    }

}

