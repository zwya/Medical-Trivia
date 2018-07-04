import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Question } from './question.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/question";

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
    return this.http.post(apiUrl, JSON.stringify(question), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getQuestion(pageNumber: number, limit: number): Observable<any> {
    return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getQuestionById(id: string): Observable<any> {
    return this.http.get(apiUrl + '/' + id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateQuestion(question: Question) {
    return this.http.patch(apiUrl + '/' + question.id, JSON.stringify(question), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteQuestion(id: string) {
    return this.http.delete(apiUrl + '/' + id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
