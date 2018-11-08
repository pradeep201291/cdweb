import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// import { AuthenticationService } from './authentication.service';
import { AuthResource } from '../auth.resource';

/**
 * 
 * 
 * @export
 * @class AuthorizationGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  /**
   * Creates an instance of AuthorizationGuard.
   * 
   * @param {AuthenticationService} user
   * @param {Router} route
   * 
   * @memberOf AuthorizationGuard
   */
  constructor(
    // private user: AuthenticationService, 
    private route: Router
    ) { }

  /**
   * 
   * 
   * @returns
   * 
   * @memberOf AuthorizationGuard
   */
  canActivate() {
    /**
     * If the user is not logged in navigate to login page
     */
    if (!(sessionStorage.getItem(AuthResource.login.currentUser))) {
      this.route.navigate(['/login']);
    }
    return true;
   // return this.user.isLoggedIn();
  }
}
