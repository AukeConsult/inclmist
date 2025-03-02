import { Component } from '@angular/core';
import { ChatgptService } from '../../chatgpt.service';

@Component({
    selector: 'app-test',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
    standalone: false
})
export class ChatComponent {
  userMessage = '';
  chatHistory: { role: string, content: string, type: string }[] = [];

  constructor(private chatService: ChatgptService) {}

  sendMessage() {
    this.chatHistory.push({ role: 'user', content: this.userMessage, type: 'text' });
    this.chatService.sendMessage(this.userMessage).subscribe((response: { choices: { message: { content: any } }[] }) => {
      // @ts-ignore
      const botReply = response.choices[0].message.content;
      this.chatHistory.push({ role: 'bot', content: botReply, type: 'text' });
    });
    this.userMessage=''
  }

  paragraphs(content: string ): string[] {
    return content.split("\n", undefined)
  }
}
