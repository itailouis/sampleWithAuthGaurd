import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from './auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('CanActivate method called from class AuthGuard..');
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {

        this.router.navigate(['/paidevents'], { queryParams: { returnUrl: state.url }});
        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/public'], { queryParams: { returnUrl: state.url }});
    return false;
}
  constructor(private router: Router,private authenticationService: AuthServiceService) {}

}
