import { Routes, RouterModule } from "@angular/router";

import { QuestionFormComponent } from "./question/question-form/question-form.component";
import { QuestionListComponent } from './question/question-list/question-list.component';
import { SigninComponent } from './auth/signin/signin.component';
import { TriviaComponent } from './trivia/trivia.component';
import { IsloggedinGuard } from './guards/isloggedin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: SigninComponent, canActivate: [IsloggedinGuard] },
  { path: 'question/form', component: QuestionFormComponent, canActivate: [AuthenticationGuard]},
  { path: 'question/form/:id', component: QuestionFormComponent, canActivate: [AuthenticationGuard]},
  { path: 'question', component: QuestionListComponent, canActivate: [AuthenticationGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'trivia', component: TriviaComponent, canActivate: [AuthenticationGuard] }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
