import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {QuestionComponent} from './queries/question.component';
import {ChatgptService} from './chatgpt.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ChatgptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
