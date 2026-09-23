import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

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

import { Navbar } from '../../../layout/navbar/navbar';
import { Sidebar } from '../../../layout/sidebar/sidebar';

import { ApplicationService } from '../../../core/services/application';
import { InterviewService } from '../../../core/services/interview';

import { Application } from '../../../core/models/application.model';
import { Interview } from '../../../core/models/interview.model';

@Component({
  selector: 'app-interview-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Navbar,
    Sidebar
  ],
  templateUrl: './interview-form.html',
  styleUrl: './interview-form.scss'
})
export class InterviewForm implements OnInit {

  interviewForm!: FormGroup;

  applications: Application[] = [];

  editing = false;

  interviewId: number | null = null;

  loading = false;

  saving = false;

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.createForm();

    this.loadApplications();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.interviewId = Number(id);

      this.loadInterview(this.interviewId);
    }
  }

  createForm(): void {

    this.interviewForm = this.formBuilder.group({

      application_id: [
        '',
        Validators.required
      ],

      interview_date: [
        '',
        Validators.required
      ],

      interview_time: [
        '',
        Validators.required
      ],

      interview_type: [
        'Online',
        Validators.required
      ],

      meeting_link: [
        '',
        Validators.pattern(
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/
        )
      ],

      interviewer_name: [
        ''
      ],

      status: [
        'Scheduled',
        Validators.required
      ],

      notes: [
        ''
      ]

    });
  }

  loadApplications(): void {

    this.applicationService.getApplications().subscribe({

      next: (applications) => {

        this.applications = applications;

        this.changeDetectorRef.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading applications:',
          error
        );

        alert(
          'Unable to load applications.'
        );
      }

    });
  }

  loadInterview(id: number): void {

    this.loading = true;

    this.interviewService
      .getInterviewById(id)
      .subscribe({

        next: (interview) => {

          this.interviewForm.patchValue({

            application_id:
              interview.application_id,

            interview_date:
              interview.interview_date,

            interview_time:
              interview.interview_time,

            interview_type:
              interview.interview_type,

            meeting_link:
              interview.meeting_link || '',

            interviewer_name:
              interview.interviewer_name || '',

            status:
              interview.status,

            notes:
              interview.notes || ''

          });

          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading interview:',
            error
          );

          alert(
            'Interview not found.'
          );

          this.router.navigate([
            '/interviews'
          ]);
        }

      });
  }

  onSubmit(): void {

    if (this.interviewForm.invalid) {

      this.interviewForm.markAllAsTouched();

      return;
    }

    this.saving = true;

    const formValue =
      this.interviewForm.value;

    const interview: Interview = {

      id: this.interviewId || 0,

      application_id:
        Number(formValue.application_id),

      interview_date:
        formValue.interview_date,

      interview_time:
        formValue.interview_time,

      interview_type:
        formValue.interview_type,

      meeting_link:
        formValue.meeting_link || '',

      interviewer_name:
        formValue.interviewer_name || '',

      status:
        formValue.status,

      notes:
        formValue.notes || ''

    };

    if (this.editing && this.interviewId) {

      this.interviewService
        .updateInterview(
          this.interviewId,
          interview
        )
        .subscribe({

          next: () => {

            alert(
              'Interview updated successfully.'
            );

            this.router.navigate([
              '/interviews'
            ]);
          },

          error: (error) => {

            console.error(
              'Error updating interview:',
              error
            );

            this.saving = false;

            alert(
              'Unable to update interview.'
            );
          }

        });

    } else {

      this.interviewService
        .addInterview(interview)
        .subscribe({

          next: () => {

            alert(
              'Interview added successfully.'
            );

            this.router.navigate([
              '/interviews'
            ]);
          },

          error: (error) => {

            console.error(
              'Error adding interview:',
              error
            );

            this.saving = false;

            alert(
              'Unable to add interview.'
            );
          }

        });
    }
  }

  isInvalid(controlName: string): boolean {

    const control =
      this.interviewForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }

}