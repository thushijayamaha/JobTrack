import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { DatePipe } from '@angular/common';
import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { ApplicationService } from '../../../core/services/application';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterLink,
    DatePipe
  ],
  templateUrl: './application-details.html',
  styleUrl: './application-details.scss'
})
export class ApplicationDetails implements OnInit {

  application: Application | undefined;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.loadApplication(
        Number(id)
      );

    } else {

      this.router.navigate([
        '/applications'
      ]);
    }
  }

  loadApplication(id: number): void {

    this.loading = true;

    this.applicationService
      .getApplicationById(id)
      .subscribe({

        next: (application) => {

          this.application =
            application;

          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading application:',
            error
          );

          alert(
            'Application not found.'
          );

          this.loading = false;

          this.router.navigate([
            '/applications'
          ]);
        }
      });
  }


  // =========================================
  // STATUS TIMELINE
  // =========================================

  isStatusCompleted(status: string): boolean {

    if (!this.application) {
      return false;
    }

    const currentStatus =
      this.application.status;

    const order = [
      'Applied',
      'Interview',
      'Selected'
    ];

    const currentIndex =
      order.indexOf(currentStatus);

    const statusIndex =
      order.indexOf(status);

    return (
      currentIndex >= statusIndex &&
      currentIndex !== -1 &&
      statusIndex !== -1
    );
  }


  isRejected(): boolean {

    return this.application?.status === 'Rejected';
  }


  getStatusClass(status: string): string {

    if (this.isRejected() && status === 'Rejected') {
      return 'completed rejected';
    }

    if (status === 'Applied') {

      return this.isStatusCompleted(status)
        ? 'completed'
        : 'pending';
    }

    if (status === 'Interview') {

      return this.isStatusCompleted(status)
        ? 'completed'
        : 'pending';
    }

    if (status === 'Selected') {

      return this.isStatusCompleted(status)
        ? 'completed selected'
        : 'pending';
    }

    return 'pending';
  }

  downloadResume(): void {
    if (!this.application) return;
    this.applicationService.downloadResume(this.application.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume';
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}