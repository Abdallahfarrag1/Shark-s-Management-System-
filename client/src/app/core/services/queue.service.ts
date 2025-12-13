import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Chair,
  QueueItem,
  AssignRequest,
  CompleteResponse,
  ChairCreateRequest,
  EnqueueRequest,
  ApiResponse,
} from '../models/queue.models';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Queue`;

  // Chair Management
  getChairs(branchId: number): Observable<Chair[]> {
    return this.http.get<Chair[]>(`${this.apiUrl}/chairs/${branchId}`);
  }

  createChair(request: ChairCreateRequest): Observable<Chair> {
    return this.http.post<Chair>(`${this.apiUrl}/chairs`, request);
  }

  deleteChair(chairId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/chairs/${chairId}`);
  }

  // Queue Operations
  enqueueBooking(request: EnqueueRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/enqueue`, request);
  }

  getQueue(branchId: number): Observable<QueueItem[]> {
    return this.http.get<QueueItem[]>(`${this.apiUrl}/queue/${branchId}`);
  }

  assignToChair(request: AssignRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/assign`, request);
  }

  completeChair(chairId: number): Observable<CompleteResponse> {
    return this.http.post<CompleteResponse>(`${this.apiUrl}/complete/${chairId}`, {});
  }

  // Public Live Queue Display
  getLiveQueue(branchId: number): Observable<
    Array<{
      id: number;
      name: string;
      assignedBarberId: number;
      assignedBarberName: string;
      occupied: boolean;
      currentBookingId: number | null;
      currentCustomerName: string | null;
    }>
  > {
    return this.http.get<
      Array<{
        id: number;
        name: string;
        assignedBarberId: number;
        assignedBarberName: string;
        occupied: boolean;
        currentBookingId: number | null;
        currentCustomerName: string | null;
      }>
    >(`${this.apiUrl}/live/${branchId}`);
  }
}
