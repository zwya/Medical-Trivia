import { Routes, RouterModule } from "@angular/router";

import { QuestionFormComponent } from "./question/question-form/question-form.component";
import { QuestionListComponent } from './question/question-list/question-list.component';

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: QuestionListComponent },
  { path: 'question/form', component: QuestionFormComponent},
  { path: 'question/form/:id', component: QuestionFormComponent},
  { path: 'question', component: QuestionListComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);
