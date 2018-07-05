import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Question } from './question.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/question";
const adminApiUrl = "/api/admin/question";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        console.log(error.error);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    }

  addQuestion(question: Question) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.post(adminApiUrl + token, JSON.stringify(question), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getQuestion(pageNumber: number, limit: number): Observable<any> {
    const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
    return this.http.get(adminApiUrl + "?page=" + pageNumber + "&limit=" + limit + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getQuestionById(id: string): Observable<any> {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.get(adminApiUrl + '/' + id + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateQuestion(question: Question) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.patch(adminApiUrl + '/' + question.id + token, JSON.stringify(question), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteQuestion(id: string) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.delete(adminApiUrl + '/' + id + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getRandomQuestion() {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + '/rand' + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getCorrectAnswer(qid: string) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + '/correct/' + qid + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
