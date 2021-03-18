import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loggedIn = this.isLoggedIn;
    this.authService.isLoggedIn().subscribe(data => {
      this.loggedIn = data;
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.credentials() !== null;
  }

  logout() {
    this.authService.logout();
  }

}
