import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { ApplicationService } from '../../../core/services/application';
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

  constructor(
    private applicationService: ApplicationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }


  // Get applications from Laravel API
  loadApplications(): void {

    this.loading = true;

    this.applicationService
      .getApplications()
      .subscribe({
        next: (applications) => {

  this.applications = applications;

  this.applyFilters();

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


  // Search + filters
  applyFilters(): void {

    this.filteredApplications =
      this.applications.filter((application) => {

        const search =
          this.searchText
            .toLowerCase()
            .trim();

        const matchesSearch =
          application.companyName
            .toLowerCase()
            .includes(search)
          ||
          application.jobTitle
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          this.selectedStatus === 'All Status'
          ||
          application.status === this.selectedStatus;

        const matchesJobType =
          this.selectedJobType === 'All Job Types'
          ||
          application.jobType === this.selectedJobType;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesJobType
        );
      });

    this.changeDetectorRef.detectChanges();
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