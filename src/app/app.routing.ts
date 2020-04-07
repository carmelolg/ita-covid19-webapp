import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'district',
        loadChildren: () => import('./provincia/provincia.module').then(m => m.ProvinciaModule)
      },
      {
        path: 'region',
        loadChildren: () => import('./regione/regione.module').then(m => m.RegioneModule)
      },
      {
        path: 'info',
        loadChildren: () => import('./info/info.module').then(m => m.InfoModule)
      }
    ]
  }
];
