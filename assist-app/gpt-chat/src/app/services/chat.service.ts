import {Injectable} from '@angular/core';
import backendApp from "shared-backend/src/index"

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
    const model = backendApp.queryModels
    return model.simpleMessage(message)
  }

  sendMessageModel(message: string) {

    if(!this.lastEntry) {
      this.lastEntry = []
    }

    this.lastEntry.entry = [
      {role: "user", content: message}
    ]
    const model = backendApp.queryModels
    return model.chatMessage(this.lastEntry)

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
