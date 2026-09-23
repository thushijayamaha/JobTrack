import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { InterviewService } from '../../../core/services/interview';
import { Interview } from '../../../core/models/interview.model';

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterLink,
    DatePipe
  ],
  templateUrl: './interview-list.html',
  styleUrl: './interview-list.scss'
})
export class InterviewList implements OnInit {

  interviews: Interview[] = [];

  loading = false;

  constructor(
    private interviewService: InterviewService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.loading = true;

    this.interviewService.getInterviews().subscribe({
      next: (interviews) => {
        this.interviews = interviews;
        this.loading = false;

        this.changeDetectorRef.detectChanges();
      },

      error: (error) => {
        console.error('Error loading interviews:', error);

        this.loading = false;

        alert('Unable to load interviews.');
      }
    });
  }

  deleteInterview(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this interview?'
    );

    if (!confirmed) {
      return;
    }

    this.interviewService.deleteInterview(id).subscribe({
      next: () => {
        this.interviews =
          this.interviews.filter(interview => interview.id !== id);

        this.changeDetectorRef.detectChanges();

        alert('Interview deleted successfully.');
      },

      error: (error) => {
        console.error('Error deleting interview:', error);

        alert('Unable to delete interview.');
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
}