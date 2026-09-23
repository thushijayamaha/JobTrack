import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.user;
  }

  get initials(): string {
    return (this.user?.name || 'User')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

}