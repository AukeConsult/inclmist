import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ChatgptService } from './chatgpt.service';
import { AppComponent } from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule

  ],
  providers: [ChatgptService],
  bootstrap: [AppComponent]
})
export class AppModule { }
