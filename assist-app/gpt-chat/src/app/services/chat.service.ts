import {Injectable} from '@angular/core';
import {ChatEntry} from 'shared-library';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private lastEntry = undefined

  constructor(private http: HttpClient, private authService: AuthService) {}

  initChat() {
    this.lastEntry=undefined
  }

  sendMessageModel(message: string) {

    if (!this.lastEntry) {
      this.lastEntry = []
    }
    this.lastEntry.uid = this.authService.getUid()
    this.lastEntry.entry = [
      {role: "user", content: message}
    ]
    return fetch("http://localhost:5000/entry", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...this.lastEntry})
    }).then((resp)=>  resp.json())
      .then((val)=> {
        this.lastEntry = val as ChatEntry
        return this.lastEntry
      }).catch((err)=> {
        console.log(err)
        return this.lastEntry
      })
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
