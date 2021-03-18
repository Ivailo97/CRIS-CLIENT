import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppSettings} from '../../common/settings';
import {ApiResponse} from '../../common/models';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  public login(base64Credentials: string): void {
    // admin:admin
    if (base64Credentials === 'YWRtaW46YWRtaW4=') {
      localStorage.setItem('Authentication', base64Credentials);
      this.loggedIn.next(true);
      this.router.navigate(['/config'])
        .then(() => console.log('login successful'));
    }
  }

  public logout(): void {
    const logoutUrl = AppSettings.API_BASE + '/auth/logout';
    this.http.post<ApiResponse>(logoutUrl, null, AppSettings.HTTP_OPTIONS)
      .subscribe(data => {
          console.log(data);
          localStorage.clear();
          this.loggedIn.next(false);
          this.router.navigate(['/login'])
            .then(() => console.log('logout successful'));
        },
        error => console.log(error));
  }

  public credentials(): string {
    return localStorage.getItem('Authentication');
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

}
