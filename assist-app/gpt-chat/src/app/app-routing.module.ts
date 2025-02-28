import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';
import {QuestionComponent} from './queries/question.component';

const routes: Routes = [
  { path: '', component: QuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
