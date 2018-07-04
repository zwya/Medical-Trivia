import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QuestionListComponent } from './question/question-list/question-list.component';
import { QuestionFormComponent } from './question/question-form/question-form.component';
import { routing } from './app.routing';
import { SigninComponent } from './auth/signin/signin.component';
import { TriviaComponent } from './trivia/trivia.component';
import { IsloggedinGuard } from './guards/isloggedin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    QuestionListComponent,
    QuestionFormComponent,
    FileSelectDirective,
    SigninComponent,
    TriviaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  providers: [IsloggedinGuard, AuthenticationGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
