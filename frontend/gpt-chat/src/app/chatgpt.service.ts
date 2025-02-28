import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// @ts-ignore
import {Observable} from 'rxjs';
import {apiKeyMain} from "../secrets"

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {
  private chatApiUrl = 'https://api.openai.com/v1/chat/completions';
  private imageApiUrl = 'https://api.openai.com/v1/images/generations';

  constructor(private http: HttpClient) {}

  sendMessage(message: string) : Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeyMain}`
    });

    const body = {
      model: 'gpt-4',
      messages: [{role: 'user', content: message}]
    };
    return this.http.post(this.chatApiUrl, body, {headers})
  }

  sendMessageDummy(message: string) : Observable<{ choices: { message: { content: any } }[] }> {

    let x: Observable<any> = new Observable(obs =>  {
      obs.next (
        {
          choices: [{
            message: {
              content: "dfsdfd  sdf sdf s df df sdf sd fs dfs df sd fs df sd f+\nlasdjlkalskdj" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "laks askdjlaksdjlaksdjlaksjdlaksjdajklsjlassdlkjalksjdlkj\n" +
                "dsfs"
            }
          }
          ]
        }
      )
      obs.complete()
    })
    return x
  }

  generateImage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeyMain}`
    });

    const body = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    };
    return this.http.post(this.imageApiUrl, body, { headers });
  }

}
