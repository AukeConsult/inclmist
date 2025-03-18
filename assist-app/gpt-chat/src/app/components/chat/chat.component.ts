import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-test',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  userMessage = '';
  chatHistory: { role: string, content: string, type: string }[] = [];
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.initChat()
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    this.chatHistory.push({ role: 'user', content: this.userMessage, type: 'text' });

    this.chatService.sendMessageModel(this.userMessage).then((res)=> {
      for (var r of res.replies) {
        this.chatHistory.push({ role: r.role, content: r.content, type: 'text' });
      }
    }).catch((err)=> {
      if(err instanceof Error) {
        this.chatHistory.push({ role: 'error', content: err.message, type: 'text' });
      }
    })
    this.userMessage=''
    this.scrollToBottom();

  }
  paragraphs(content: string ): string[] {
    return content.split("\n", undefined)
  }

}
