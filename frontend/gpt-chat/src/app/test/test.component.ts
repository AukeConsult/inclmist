import { Component } from '@angular/core';
import { ChatgptService } from '../chatgpt.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  userMessage = '';
  chatHistory: { role: string, content: string, type: string }[] = [];

  constructor(private chatService: ChatgptService) {}

  sendMessage() {
    this.chatHistory.push({ role: 'user', content: this.userMessage, type: 'text' });
    this.chatService.sendMessage(this.userMessage).subscribe((response: { choices: { message: { content: any; }; }[]; }) => {
      const botReply = response.choices[0].message.content;
      alert(botReply)
      this.chatHistory.push({ role: 'bot', content: botReply, type: 'text' });
    });
    this.userMessage=''
  }
}
