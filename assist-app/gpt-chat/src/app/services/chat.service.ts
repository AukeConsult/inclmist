import {Injectable} from '@angular/core';
import {ChatEntry} from 'shared-library';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private lastEntry = undefined

  constructor() {}

  initChat() {
    this.lastEntry=undefined
  }

  sendSimpleMessageModel(message: string) {
    // const model = backendApp.queryModels()
    // return model.simpleMessage(message)
    //return new Promise<ChatEntry>(()=> {} )
  }

  sendMessageModel(message: string) {

    if(!this.lastEntry) {
      this.lastEntry = []
    }
    console.log("hello")
    this.lastEntry.entry = [
      {role: "user", content: message}
    ]
    //const model = backendApp.queryModels()
    //return model.chatMessage(this.lastEntry)
    return new Promise<ChatEntry>(()=> {} )
  }

  // generateImage(prompt: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     //'Authorization': `Bearer ${openAiApiKey}`
  //   });
  //
  //   const body = {
  //     model: "dall-e-3",
  //     prompt: prompt,
  //     n: 1,
  //     size: "1024x1024"
  //   };
  //   return this.http.post(this.imageApiUrl, body, { headers });
  // }

}
