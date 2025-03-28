import {
    ChatDialog,
    ChatEntry,
    ChatMessage,
    QueryParameters,
    ModelAccount,
    ChatTrainStorage
} from "../";

import OpenAI from "openai";
import {firestore} from "firebase-admin";

export class TrainModels {

    public storeage: ChatTrainStorage

    constructor(private db: firestore.Firestore,
                public modelAccount: ModelAccount,
                public skipModel: boolean) {
        this.storeage = new ChatTrainStorage(this.db)
    }
    public async sendEntry(message: ChatEntry)  {
        try {
            return this.processQuestion(message)
        } catch (error) {
            if(error instanceof Error) {
                throw new Error(error.message)
            } else {
                throw error
            }
        }
    }

    private async processQuestion(chatEntry: ChatEntry ) : Promise<any> {

        await this.storeage.initEntry(chatEntry)
        const chatDialog = await this.storeage.getDialog(chatEntry)
        var queryDescriptor
        if(chatEntry.queryDescriptor) {
            queryDescriptor = chatEntry.queryDescriptor
        } else {
            queryDescriptor = await this.storeage.getQueryDecription(chatEntry)
        }
        if(queryDescriptor && chatDialog) {

            const results: ChatMessage[] = []

            // only add latest
            if(chatDialog.history) {
                const newhistory = []
                newhistory.push(...chatDialog.history)
                chatDialog.history = newhistory
            }
            for (const parameter of queryDescriptor.queryParameters) {
                if (this.skipModel) {
                    if(chatEntry.entry) {
                        results.push(...chatEntry.entry)
                    }
                } else {
                    // read model
                    const results_query = await this.doChatCompletion(
                        chatDialog,
                        parameter,
                        chatEntry
                    )
                    results.push(...results_query)
                }
            }
            return this.storeage.storeChatEntry(chatEntry, results)

        } else {
            throw new Error(
                "NO-SPECIFICATION")
        }
    }

    async doChatCompletion(

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
        if(chatDialog && chatDialog.history) {

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
            apiKey: this.modelAccount.openAiApiKey, // This is the default and can be omitted
        });

        const model: string | undefined = parameters.modelId?.toString()
        if(model) {
            try {
                const ret = await client.chat.completions.create(
                    {
                        model: model,
                        messages: [...chatMessages],
                        user: chatEntry.uid
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
                if(!chatDialog.history) {
                    chatDialog.history = []
                }
                chatDialog.history.push(...results)

            } catch(error) {
                console.log(error)
                throw error
            }

        } else {
            const err = new Error("NO-MODEL-ID")
            console.error(err)
            throw err
        }
        return results

    }

}





