import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {ChatComponent} from './queries/chat.component';
import {ChatgptService} from './chatgpt.service';
import {HttpClientModule} from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

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
  ],
  providers: [
    ChatgptService,
    provideFirebaseApp(() => initializeApp(
      { projectId: "collect-server",
        appId: "1:1063969642181:web:a0532c53e0d2d7c2eb02ac",
        storageBucket: "collect-server.firebasestorage.app",
        apiKey: "AIzaSyCEJKLysW6AxEbM_VyC8NTRgVdsseHL55E",
        authDomain: "collect-server.firebaseapp.com",
        messagingSenderId: "1063969642181"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
