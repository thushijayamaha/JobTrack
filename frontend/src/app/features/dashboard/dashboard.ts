import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { Navbar } from '../../layout/navbar/navbar';
import { Sidebar } from '../../layout/sidebar/sidebar';

import { ApplicationService } from '../../core/services/application';
import { Application } from '../../core/models/application.model';

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js';
import { finalize, timeout } from 'rxjs';

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController
);

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    Navbar,
    Sidebar,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {

  applications: Application[] = [];

  totalApplications = 0;
  appliedApplications = 0;
  interviewApplications = 0;
  selectedApplications = 0;
  rejectedApplications = 0;

  loading = false;
  errorMessage = '';

  private chart: Chart | null = null;
  private applicationsLoaded = false;
  private chartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('applicationStatusChart')
  set applicationStatusChart(
    canvas: ElementRef<HTMLCanvasElement> | undefined
  ) {
    this.chartCanvas = canvas;

    if (canvas && this.applicationsLoaded) {
      this.createStatusChart();
    }
  }

  constructor(
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Chart will be created after API data is loaded.
  }

  loadDashboardData(): void {

    this.loading = true;
    this.errorMessage = '';

    this.applicationService
      .getApplications({ per_page: 100 })
      .pipe(
        timeout(10000),
        finalize(() => this.loading = false)
      )
      .subscribe({

        next: (applications) => {

          console.log(
            'Dashboard applications:',
            applications
          );

          this.applications = applications.applications;

          this.totalApplications =
            this.applications.length;

          this.appliedApplications =
            this.applications.filter(
              application =>
                application.status === 'Applied'
            ).length;

          this.interviewApplications =
            this.applications.filter(
              application =>
                application.status === 'Interview'
            ).length;

          this.selectedApplications =
            this.applications.filter(
              application =>
                application.status === 'Selected'
            ).length;

          this.rejectedApplications =
            this.applications.filter(
              application =>
                application.status === 'Rejected'
            ).length;

          this.applicationsLoaded = true;

          if (this.chartCanvas) {
            this.createStatusChart();
          }
        },

        error: (error) => {

          console.error(
            'Error loading dashboard data:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to load dashboard data.';
        }
      });
  }

  createStatusChart(): void {

    const canvas = this.chartCanvas?.nativeElement;

    if (!canvas) {
      console.error(
        'Chart canvas not found.'
      );
      return;
    }

    // Destroy previous chart if it exists.
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const statusValues = [
      this.appliedApplications,
      this.interviewApplications,
      this.selectedApplications,
      this.rejectedApplications
    ];
    const hasApplications = this.totalApplications > 0;

    this.chart = new Chart(
      canvas,
      {
        type: 'doughnut',

        data: {
          labels: hasApplications
            ? ['Applied', 'Interview', 'Selected', 'Rejected']
            : ['No applications'],

          datasets: [
            {
              data: hasApplications ? statusValues : [1],

              backgroundColor: hasApplications
                ? ['#2563eb', '#ea580c', '#059669', '#dc2626']
                : ['#d1d5db'],

              borderWidth: 2
            }
          ]
        },

        options: {
          responsive: true,

          maintainAspectRatio: false,

          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    );
  }

  ngOnDestroy(): void {

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}