import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, throwError } from 'rxjs';
import { switchMap, map, take, retryWhen, delay, catchError, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LightXService {
    private readonly API_KEY = '9101c9def7b84d65a6b5a32f11bf058d_fa1695d7cb6849758a804dc9cde25f2b_andoraitools';
    private readonly BASE_URL = '/api/lightx'; // Uses proxy to https://api.lightxeditor.com/external/api

    constructor(private http: HttpClient) { }

    generateHairstyle(image: File, prompt: string): Observable<string> {
        return this.getUploadUrl(image).pipe(
            switchMap(uploadData => {
                return this.uploadImage(uploadData.body.uploadImage, image).pipe(
                    map(() => uploadData.body.imageUrl)
                );
            }),
            switchMap(imageUrl => this.initiateGeneration(imageUrl, prompt)),
            switchMap(orderId => this.pollStatus(orderId))
        );
    }

    private getUploadUrl(image: File): Observable<any> {
        const url = `${this.BASE_URL}/v2/uploadImageUrl`;
        const body = {
            uploadType: 'imageUrl', // Fixed value as per doc
            size: image.size,
            contentType: image.type
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY
        });

        return this.http.post<any>(url, body, { headers }).pipe(
            map(response => {
                if (response.statusCode !== 2000) {
                    throw new Error(`LightX Upload URL Error: ${response.message}`);
                }
                return response;
            })
        );
    }

    private uploadImage(uploadUrl: string, image: File): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': image.type
        });
        return this.http.put(uploadUrl, image, { headers });
    }

    private initiateGeneration(imageUrl: string, prompt: string): Observable<string> {
        const url = `${this.BASE_URL}/v2/hairstyle`;
        const body = {
            imageUrl: imageUrl,
            textPrompt: prompt
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY
        });

        return this.http.post<any>(url, body, { headers }).pipe(
            map(response => {
                if (response.statusCode !== 2000) {
                    throw new Error(`LightX Generation Error: ${response.message}`);
                }
                return response.body.orderId;
            })
        );
    }

    private pollStatus(orderId: string): Observable<string> {
        const url = `${this.BASE_URL}/v2/order-status`;
        const body = { orderId: orderId };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY
        });

        return interval(3000).pipe(
            switchMap(() => this.http.post<any>(url, body, { headers })),
            map(response => {
                if (response.statusCode !== 2000) {
                    throw new Error(`LightX Status Error: ${response.message}`);
                }
                return response.body;
            }),
            filter(data => data && (data.status === 'active' || data.status === 'failed')),
            take(1),
            map(data => {
                if (data.status === 'failed') {
                    throw new Error('Hairstyle generation failed');
                }
                return data.output;
            }),
            retryWhen(errors => errors.pipe(delay(3000), take(10))), // Retry logic handled by interval/filter, this is for request errors
            catchError(error => {
                console.error('Polling failed', error);
                return throwError(() => new Error('Failed to get generation result'));
            })
        );
    }
}
