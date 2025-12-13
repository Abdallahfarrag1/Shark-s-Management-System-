import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CloudinaryUploadResponse {
  secure_url: string;
  url: string;
  public_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  // Cloudinary configuration
  private cloudName = 'duxf4pm9u';
  private uploadPreset = 'Sharks';
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(this.uploadUrl, formData);
  }
}
