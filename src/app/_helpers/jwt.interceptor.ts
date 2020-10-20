import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../utils/auth-service.service';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthServiceService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Intercept method called from JWTInterceptor..");
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                    admin: "Irshad",
                    Host: "localhost://3400"
                }
            });
        }
        return next.handle(request);
    }
}