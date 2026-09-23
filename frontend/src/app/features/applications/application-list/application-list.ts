import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { ApplicationQuery, ApplicationService } from '../../../core/services/application';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterLink,
    FormsModule
  ],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss'
})
export class ApplicationList implements OnInit {

  applications: Application[] = [];

  filteredApplications: Application[] = [];

  searchText: string = '';

  selectedStatus: string = 'All Status';

  selectedJobType: string = 'All Job Types';

  loading: boolean = false;

  currentPage = 1;
  lastPage = 1;
  totalApplications = 0;
  perPage = 10;
  sortField = 'application_date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }


  // Get applications from Laravel API
  loadApplications(): void {

    this.loading = true;

    this.applicationService
      .getApplications(this.query)
      .subscribe({
        next: (applications) => {

  this.applications = applications.applications;
  this.filteredApplications = applications.applications;
  this.currentPage = applications.currentPage;
  this.lastPage = applications.lastPage;
  this.totalApplications = applications.total;

  this.loading = false;
},

        error: (error) => {

          console.error(
            'Error loading applications:',
            error
          );

          this.loading = false;
        }
      });
  }


  get query(): ApplicationQuery {
    return {
      search: this.searchText.trim() || undefined,
      status: this.selectedStatus === 'All Status' ? undefined : this.selectedStatus,
      job_type: this.selectedJobType === 'All Job Types' ? undefined : this.selectedJobType,
      sort: this.sortField,
      direction: this.sortDirection,
      page: this.currentPage,
      per_page: this.perPage
    };
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadApplications();
  }

  exportCsv(): void {
    this.applicationService.exportCsv().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jobtrack-applications.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
  }


  // Delete application
  deleteApplication(id: number): void {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this application?'
      );

    if (!confirmDelete) {
      return;
    }

    this.applicationService
      .deleteApplication(id)
      .subscribe({

        next: () => {

          alert(
            'Application deleted successfully!'
          );

          this.loadApplications();
        },

        error: (error) => {

          console.error(
            'Error deleting application:',
            error
          );

          alert(
            'Failed to delete application.'
          );
        }

      });
  }

}