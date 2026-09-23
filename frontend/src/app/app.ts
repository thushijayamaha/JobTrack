import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('jobtrack-frontend');

  constructor() {
    document.body.classList.toggle(
      'theme-dark',
      localStorage.getItem('jobtrack_theme') === 'dark'
    );
  }
}
