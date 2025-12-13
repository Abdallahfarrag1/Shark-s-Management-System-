import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Backend API response structure
export interface Branch {
  id: number;
  name: string;
  location: string;
  managerId?: string;
  imageUrl?: string;
  managerEmail?: string; // Add this
}

// Extended interface for UI usage (optional fields)
export interface BranchExtended extends Branch {
  phone?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  isOpen?: boolean;
  description?: string;
  hours?: string;
  services?: string[];
  barbers?: any[];
  managerName?: string;
  staff?: number;
  status?: string;
  revenue?: number;
  photo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private apiUrl = `${environment.apiUrl}/Branch`;

  // Signal to hold branches state
  branches = signal<BranchExtended[]>([]);

  constructor(private http: HttpClient) {}

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((branches) =>
        branches.map((b) => ({
          ...b,
          image: b.imageUrl || b.image, // Map imageUrl from API to image for frontend
        }))
      ),
      tap((branches) => {
        // Update signal with fetched data
        this.branches.set(branches);
      })
    );
  }

  getBranch(id: number | string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/${id}`);
  }

  createBranch(formData: FormData): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, formData);
  }

  updateBranch(id: number, formData: FormData): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/${id}`, formData);
  }

  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
