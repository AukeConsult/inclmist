import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// @ts-ignore
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {
  private chatApiUrl = 'https://api.openai.com/v1/chat/completions';
  private imageApiUrl = 'https://api.openai.com/v1/images/generations';

  private apiKey=""

  constructor(private http: HttpClient) {}

  sendMessage(message: string) : Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-4',
      messages: [{role: 'user', content: message}]
    };
    return this.http.post(this.chatApiUrl, body, {headers})
  }
  generateImage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
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
