import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../_model/user';

@Injectable({
providedIn: 'root'
})
export class AuthServiceService {

private currentUserSubject: BehaviorSubject<User>;
public currentUser: Observable<User>;
private _loginUrl = "api/login";
private _registerUrl = "api/register";
constructor(private http: HttpClient) {
this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
this.currentUser = this.currentUserSubject.asObservable();
}

public get currentUserValue(): User {
return this.currentUserSubject.value;
}

getAuthToken(){
return "TOKEN-001001010100111";
}
registerUser(user) {
return this.http.post<any>(this._registerUrl, user);
}
// tslint:disable-next-line: typedef
login(user) {
return this.http.post<any>(this._loginUrl, user);
}

authenticate(loginData) {
return this.http.post<any>("http://localhost:4200/api/login", loginData)
.pipe(map(user => {
// login successful if there's a jwt token in the response
if (user && user.token) {
// store user details and jwt token in local storage to keep user logged in between page refreshes
sessionStorage.setItem('currentUser', JSON.stringify(user));
this.currentUserSubject.next(user);
}

return user;
}));
}

logout() {
// remove user from local storage to log user out
sessionStorage.removeItem('currentUser');
this.currentUserSubject.next(null);
}
}
