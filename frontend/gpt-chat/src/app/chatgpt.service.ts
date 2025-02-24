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
  private apiKey = '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';  // Replace with your OpenAI API key

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
