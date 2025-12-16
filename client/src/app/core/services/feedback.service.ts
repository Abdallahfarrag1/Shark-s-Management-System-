import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreateFeedbackRequest } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/Feedback`;

  constructor(private http: HttpClient) {}

  submitFeedback(branchId: number, rating: number): Observable<boolean> {
    const request: CreateFeedbackRequest = {
      branchId,
      rating,
    };

    return this.http.post<boolean>(this.apiUrl, request).pipe(
      map((response) => {
        // If response is true, submission was successful
        // If response is false, user already submitted today
        return response;
      }),
      catchError((error) => {
        console.error('Error submitting feedback:', error);
        throw error;
      })
    );
  }
}
