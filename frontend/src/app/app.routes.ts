import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // Default
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then((m) => m.Login)
  },


  // Register
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then((m) => m.Register)
  },


  // Dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then((m) => m.Dashboard)
  },


  // Application List
  {
    path: 'applications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/applications/application-list/application-list')
        .then((m) => m.ApplicationList)
  },


  // Add Application
  {
    path: 'applications/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/applications/application-form/application-form')
        .then((m) => m.ApplicationForm)
  },


  // Edit Application
  {
    path: 'applications/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/applications/application-form/application-form')
        .then((m) => m.ApplicationForm)
  },


  // View Application Details
  {
    path: 'applications/view/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/applications/application-details/application-details')
        .then((m) => m.ApplicationDetails)
  },

  {
  path: 'profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/profile/profile')
      .then(m => m.Profile)
},

{
  path: 'interviews',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/interviews/interview-list/interview-list')
      .then((m) => m.InterviewList)
},

{
  path: 'interviews/view/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/interviews/interview-details/interview-details')
      .then((m) => m.InterviewDetails)
},

{
  path: 'interviews/add',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/interviews/interview-form/interview-form')
      .then((m) => m.InterviewForm)
},
{
  path: 'interviews/edit/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/interviews/interview-form/interview-form')
      .then((m) => m.InterviewForm)
},

  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/settings')
        .then(m => m.Settings)
  },





  // Unknown URL
  {
    path: '**',
    redirectTo: 'login'
  }

];