import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../layout/navbar/navbar';
import { Sidebar } from '../../layout/sidebar/sidebar';

import {
  ProfileService,
  UserProfile
} from '../../core/services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  user: UserProfile | null = null;

  loading = false;
  saving = false;

  editMode = false;

  name = '';
  email = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private profileService: ProfileService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.profileService.getProfile().subscribe({
      next: (response) => {

        if (response.success) {
          this.user = response.user;

          this.name = response.user.name;
          this.email = response.user.email;
        }

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },

      error: (error) => {
        console.error('Error loading profile:', error);

        this.errorMessage =
          'Unable to load your profile. Please try again.';

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  startEditing(): void {
    if (!this.user) {
      return;
    }

    this.name = this.user.name;
    this.email = this.user.email;

    this.errorMessage = '';
    this.successMessage = '';

    this.editMode = true;
  }

  cancelEditing(): void {
    if (this.user) {
      this.name = this.user.name;
      this.email = this.user.email;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.editMode = false;
  }

  saveProfile(): void {

    if (!this.name.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService
      .updateProfile(
        this.name.trim(),
        this.email.trim()
      )
      .subscribe({
        next: (response) => {

          if (response.success) {
            this.user = response.user;

            this.name = response.user.name;
            this.email = response.user.email;

            this.editMode = false;

            this.successMessage =
              'Profile updated successfully.';
          }

          this.saving = false;
        },

        error: (error) => {
          console.error('Error updating profile:', error);

          if (error.status === 422 && error.error?.errors) {

            const validationErrors =
              error.error.errors;

            const firstError =
              Object.values(validationErrors)[0];

            if (Array.isArray(firstError)) {
              this.errorMessage =
                firstError[0] as string;
            } else {
              this.errorMessage =
                'Please check your information.';
            }

          } else {
            this.errorMessage =
              'Unable to update your profile. Please try again.';
          }

          this.saving = false;
        }
      });
  }

  getInitials(): string {

    if (!this.user?.name) {
      return 'U';
    }

    const words = this.user.name
      .trim()
      .split(' ')
      .filter(word => word.length > 0);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}