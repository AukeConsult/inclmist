import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';
import {ChatComponent} from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
