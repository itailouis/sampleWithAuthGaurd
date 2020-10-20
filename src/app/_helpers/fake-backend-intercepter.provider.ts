import { Injectable } from '@angular/core';  
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';  
import { Observable, of, throwError } from 'rxjs';  
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';  
import * as jwt_decode from 'jwt-decode';  
  
// array in local storage for registered users  
let users = JSON.parse(localStorage.getItem('users')) || [];  
  
@Injectable()  
export class FakeBackendInterceptor implements HttpInterceptor {  
    constructor(){}  
  
      
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        // Token for admin user  
        const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZmlyc3ROYW1lIjoiTW9oYW1tYWQiLCJsYXN0TmFtZSI6Iklyc2hhZCJ9.apXr_qMJrzvYczZbfW23UfJdzmMaaCA8d7Njm8tN9wI";  
        // Token for non-admin users  
        const userToken = "fake-jwt-token";  
        const { url, method, headers, body } = request;  
        return of(null)  
            .pipe(mergeMap(handleRoute))  
            .pipe(materialize())   
            .pipe(delay(500))  
            .pipe(dematerialize());  
  
        function handleRoute() {  
            switch (true) {  
                case url.endsWith('/api/login') && method === 'POST':  
                    return authenticate();  
                case url.endsWith('api/register') && method === 'POST':  
                    return register();  
                case url.endsWith('/users') && method === 'GET':  
                    return getUsers();  
                case url.endsWith('/events') && method === 'GET':  
                    return getEvents();  
                case url.endsWith('/paidEvents') && method === 'GET':  
                    return getPaidEvents();  
                case url.match(/\/users\/\d+$/) && method === 'DELETE':  
                    return deleteUser();  
                default:  
                    return next.handle(request);  
            }      
        }  
  
        function authenticate() {  
            const { username, password } = body;  
            if(username=='admin' && password=='1'){  
                var admin = jwt_decode(adminToken);  
                admin.isAdmin = true;  
                admin.token = adminToken;  
                return ok(admin);  
            }   
            const user = users.find(x => x.username === username && x.password === password);  
            if (!user) return error('Username or password is incorrect');  
              
            return ok({  
                id: user.id,  
                username: user.username,  
                firstName: user.firstName,  
                lastName: user.lastName,  
                isAdmin: false,  
                token: userToken  
            })  
        }  
  
        function register() {  
            const user = body  
  
            if (users.find(x => x.username === user.username)) {  
                return error('Username "' + user.username + '" is already taken');  
            }  
  
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;  
            user.isAdmin = false;  
            users.push(user);  
            localStorage.setItem('users', JSON.stringify(users));  
  
            return ok('Successfully created');  
        }  
  
        function getUsers() {  
            if (!isLoggedIn()) return unauthorized();  
            return ok(users);  
        }  
  
        function deleteUser() {  
            if (!isLoggedIn()) return unauthorized();  
  
            users = users.filter(x => x.id !== idFromUrl());  
            localStorage.setItem('users', JSON.stringify(users));  
            return ok();  
        }  
  
        function ok(body?) {  
            return of(new HttpResponse({ status: 200, body }))  
        }  
  
        function error(message) {  
            return throwError({ error: { message } });  
        }  
  
        function unauthorized() {  
            return throwError({ status: 401, error: { message: 'Unauthorised' } });  
        }  
  
        function isLoggedIn() {  
            return headers.get('Authorization') === 'Bearer ' + userToken || headers.get('Authorization') === 'Bearer '+ adminToken;  
        }  
  
        function getEvents() {  
            return ok(events);  
        }  
  
        function getPaidEvents() {  
            if (!isLoggedIn()) return unauthorized();  
            return ok(paidEvents);  
        }  
  
        function idFromUrl() {  
            const urlParts = url.split('/');  
            return parseInt(urlParts[urlParts.length - 1]);  
        }  
    }  
}  
  
let events = [  
    {  
        "id": "1",  
        "name": "event1",  
        "place": "place1",  
        "date": "date1"  
    },  
    {  
        "id": "2",  
        "name": "event3",  
        "place": "place2",  
        "date": "date2"  
    },  
    {  
        "id": "3",  
        "name": "event3",  
        "place": "place3",  
        "date": "date3"  
    },  
    {  
        "id": "4",  
        "name": "event4",  
        "place": "place4",  
        "date": "date4"  
    },  
    {  
        "id": "5",  
        "name": "event5",  
        "place": "place5",  
        "date": "date5"  
    }  
];  
  
let paidEvents = [  
    {  
        "id": "1",  
        "name": "paidEvent1",  
        "place": "place1",  
        "date": "date1"  
    },  
    {  
        "id": "2",  
        "name": "paidEvent3",  
        "place": "place2",  
        "date": "date2"  
    },  
    {  
        "id": "3",  
        "name": "paidEvent3",  
        "place": "place3",  
        "date": "date3"  
    },  
    {  
        "id": "4",  
        "name": "paidEvent4",  
        "place": "place4",  
        "date": "date4"  
    },  
    {  
        "id": "5",  
        "name": "paidEvent5",  
        "place": "place5",  
        "date": "date5"  
    }  
];  
  
export const fakeBackendProvider = {  
    // use fake backend in place of Http service for backend-less development  
    provide: HTTP_INTERCEPTORS,  
    useClass: FakeBackendInterceptor,  
    multi: true  
};