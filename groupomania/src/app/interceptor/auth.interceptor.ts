import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!localStorage.getItem("Users")) {
      return next.handle(req);
    } else {
      const authToken = JSON.parse(localStorage.getItem("Users")).Token
      const newRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(newRequest);

    }
  }
}