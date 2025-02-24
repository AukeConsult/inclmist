import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';
import {TestComponent} from './test/test.component';

const routes: Routes = [
  { path: '', component: TestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
