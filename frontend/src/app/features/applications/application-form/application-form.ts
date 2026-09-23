import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ApplicationService } from '../../../core/services/application';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './application-form.html',
  styleUrl: './application-form.scss'
})
export class ApplicationForm implements OnInit {

  applicationForm: FormGroup;

  isEditMode = false;
  applicationId: number | null = null;

  loading = false;
  submitting = false;
  resumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.applicationForm = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobType: ['Internship', Validators.required],
      applicationDate: ['', Validators.required],
      status: ['Applied', Validators.required],
      jobUrl: [''],
      salary: [''],
      location: [''],
      notes: ['']
    });
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.resumeFile = input.files?.[0] ?? null;
  }

  private finishSave(application: Application, message: string): void {
    const upload = this.resumeFile && application.id
      ? this.applicationService.uploadResume(application.id, this.resumeFile)
      : null;

    if (upload) {
      upload.subscribe({
        next: () => this.completeSave(message),
        error: () => {
          alert('Application saved, but the resume upload failed.');
          this.completeSave(message);
        }
      });
    } else {
      this.completeSave(message);
    }
  }

  private completeSave(message: string): void {
    alert(message);
    this.submitting = false;
    this.router.navigate(['/applications']);
  }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.applicationId = Number(id);

      this.loadApplication(
        this.applicationId
      );
    }
  }

  loadApplication(id: number): void {

    this.loading = true;

    this.applicationService
      .getApplicationById(id)
      .subscribe({
        next: (application) => {

          this.applicationForm.patchValue({
            companyName:
              application.companyName,

            jobTitle:
              application.jobTitle,

            jobType:
              application.jobType,

            applicationDate:
              application.applicationDate,

            status:
              application.status,

            jobUrl:
              application.jobUrl,

            salary:
              application.salary,

            location:
              application.location,

            notes:
              application.notes
          });

          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading application:',
            error
          );

          alert(
            'Failed to load application.'
          );

          this.loading = false;

          this.router.navigate([
            '/applications'
          ]);
        }
      });
  }

  onSubmit(): void {

    if (this.applicationForm.invalid) {

      this.applicationForm.markAllAsTouched();

      return;
    }

    const formValue =
      this.applicationForm.value;

    const application: Application = {
      id: this.applicationId ?? 0,

      companyName:
        formValue.companyName,

      jobTitle:
        formValue.jobTitle,

      jobType:
        formValue.jobType,

      applicationDate:
        formValue.applicationDate,

      status:
        formValue.status,

      jobUrl:
        formValue.jobUrl,

      salary:
        formValue.salary,

      location:
        formValue.location,

      notes:
        formValue.notes
    };

    this.submitting = true;

    if (
      this.isEditMode &&
      this.applicationId !== null
    ) {

      this.applicationService
        .updateApplication(
          this.applicationId,
          application
        )
        .subscribe({
          next: (savedApplication) => this.finishSave(savedApplication, 'Application updated successfully!'),

          error: (error) => {

            console.error(
              'Error updating application:',
              error
            );

            alert(
              'Failed to update application.'
            );

            this.submitting = false;
          }
        });

    } else {

      this.applicationService
        .addApplication(application)
        .subscribe({
          next: (savedApplication) => this.finishSave(savedApplication, 'Application added successfully!'),

          error: (error) => {

            console.error(
              'Error adding application:',
              error
            );

            alert(
              'Failed to add application.'
            );

            this.submitting = false;
          }
        });
    }
  }
}