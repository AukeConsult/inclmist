import {NgModule} from '@angular/core';
import {ChatComponent} from './components/chat/chat.component';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {ChatgptService} from './chatgpt.service';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    FooterComponent,
    HeaderComponent,
  ],
  providers: [
    ChatgptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
