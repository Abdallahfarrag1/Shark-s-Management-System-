import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Barber {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  branchId: number;
}

export interface DayScheduleData {
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export interface BarberSchedule {
  days: {
    [key: string]: DayScheduleData;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  private apiUrl = `${environment.apiUrl}/Barber`;
  private scheduleApiUrl = `${environment.apiUrl}/BarberSchedule`;

  constructor(private http: HttpClient) {}

  getBarbers(): Observable<Barber[]> {
    return this.http.get<Barber[]>(this.apiUrl);
  }

  getBarber(id: number): Observable<Barber> {
    return this.http.get<Barber>(`${this.apiUrl}/${id}`);
  }

  createBarber(barber: Barber): Observable<Barber> {
    return this.http.post<Barber>(this.apiUrl, barber);
  }

  updateBarber(id: number, barber: Barber): Observable<Barber> {
    return this.http.put<Barber>(`${this.apiUrl}/${id}`, barber);
  }

  deleteBarber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateBarberSchedule(barberId: number, schedule: BarberSchedule): Observable<any> {
    return this.http.put(`${this.scheduleApiUrl}/${barberId}`, schedule);
  }
}
