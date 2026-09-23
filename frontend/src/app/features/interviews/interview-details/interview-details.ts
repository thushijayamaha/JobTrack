import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { DatePipe } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { InterviewService } from '../../../core/services/interview';
import { Interview } from '../../../core/models/interview.model';

@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterLink,
    DatePipe
  ],
  templateUrl: './interview-details.html',
  styleUrl: './interview-details.scss'
})
export class InterviewDetails implements OnInit {

  interview: Interview | null = null;

  loading = false;

  constructor(
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.router.navigate([
        '/interviews'
      ]);

      return;
    }

    this.loadInterview(Number(id));
  }

  loadInterview(id: number): void {

    this.loading = true;

    this.interviewService
      .getInterviewById(id)
      .subscribe({

        next: (interview) => {

          this.interview = interview;

          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading interview:',
            error
          );

          this.loading = false;

          alert(
            'Interview not found.'
          );

          this.router.navigate([
            '/interviews'
          ]);
        }

      });
  }

  deleteInterview(): void {

    if (!this.interview) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this interview?'
    );

    if (!confirmed) {
      return;
    }

    this.interviewService
      .deleteInterview(this.interview.id)
      .subscribe({

        next: () => {

          alert(
            'Interview deleted successfully.'
          );

          this.router.navigate([
            '/interviews'
          ]);
        },

        error: (error) => {

          console.error(
            'Error deleting interview:',
            error
          );

          alert(
            'Unable to delete interview.'
          );
        }

      });
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'Scheduled':
        return 'status-scheduled';

      case 'Completed':
        return 'status-completed';

      case 'Cancelled':
        return 'status-cancelled';

      default:
        return '';
    }
  }

  getTypeIcon(type: string): string {

    switch (type) {

      case 'Online':
        return 'bi-camera-video';

      case 'On-site':
        return 'bi-building';

      case 'Phone':
        return 'bi-telephone';

      default:
        return 'bi-calendar-event';
    }
  }

  formatTime(time: string): string {

    if (!time) {
      return '';
    }

    const parts = time.split(':');

    if (parts.length < 2) {
      return time;
    }

    const hours = Number(parts[0]);
    const minutes = parts[1];

    const period =
      hours >= 12 ? 'PM' : 'AM';

    const displayHour =
      hours % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  }

}