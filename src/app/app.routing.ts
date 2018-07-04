import { Routes, RouterModule } from "@angular/router";

import { QuestionFormComponent } from "./question/question-form/question-form.component";
import { QuestionListComponent } from './question/question-list/question-list.component';
import { SigninComponent } from './auth/signin/signin.component';

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: SigninComponent },
  { path: 'question/form', component: QuestionFormComponent},
  { path: 'question/form/:id', component: QuestionFormComponent},
  { path: 'question', component: QuestionListComponent },
  { path: 'signin', component: SigninComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
