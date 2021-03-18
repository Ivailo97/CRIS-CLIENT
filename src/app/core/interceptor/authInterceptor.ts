import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.endsWith(':7000/api')) {
      const credentials = localStorage.getItem('Authentication');
      const modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Basic ${credentials}`),
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
