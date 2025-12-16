import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserOrdersAndBookingsDto } from '../models/models';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Users`;
  private userdataUrl = `${environment.apiUrl}/userdata`;

  constructor(private http: HttpClient) {}

  getNonAdminUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/non-admin`);
  }

  getUserHistory(userId: string): Observable<UserOrdersAndBookingsDto> {
    return this.http.get<UserOrdersAndBookingsDto>(`${this.userdataUrl}/user/${userId}`);
  }
}
