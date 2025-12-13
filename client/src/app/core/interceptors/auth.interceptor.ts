import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('refresh-token') &&
        !req.url.includes('login')
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const currentToken = localStorage.getItem('token');
          const currentRefreshToken = localStorage.getItem('refreshToken');

          if (currentToken && currentRefreshToken) {
            return authService.refreshAuthToken(currentToken, currentRefreshToken).pipe(
              switchMap((response) => {
                isRefreshing = false;
                authService.updateTokens(response.token, response.refreshToken);
                refreshTokenSubject.next(response.token);

                return next(
                  req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${response.token}`,
                    },
                  })
                );
              }),
              catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
              })
            );
          } else {
            authService.logout();
          }
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`,
                  },
                })
              );
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
