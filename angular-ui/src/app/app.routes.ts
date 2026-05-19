import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '',          loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'farmers',  loadComponent: () => import('./farmers/farmers.component').then(m => m.FarmersComponent) },
  { path: 'crops',    loadComponent: () => import('./crops/crops.component').then(m => m.CropsComponent) },
  { path: 'schemes',  loadComponent: () => import('./schemes/schemes.component').then(m => m.SchemesComponent) },
  { path: '**',       redirectTo: '' },
];
