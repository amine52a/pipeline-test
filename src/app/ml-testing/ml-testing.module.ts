import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MlTestingDashboardComponent } from './ml-testing-dashboard/ml-testing-dashboard.component';
import { MlMatchingTestComponent } from './ml-matching-test/ml-matching-test.component';
import { MlPrixTestComponent } from './ml-prix-test/ml-prix-test.component';
import { MlProfilTestComponent } from './ml-profil-test/ml-profil-test.component';
import { MlFeasibilityTestComponent } from './ml-feasibility-test/ml-feasibility-test.component';

const routes: Routes = [
  {
    path: '',
    component: MlTestingDashboardComponent,
    children: [
      { path: '', redirectTo: 'matching', pathMatch: 'full' },
      { path: 'matching', component: MlMatchingTestComponent },
      { path: 'prix', component: MlPrixTestComponent },
      { path: 'profil', component: MlProfilTestComponent },
      { path: 'feasibility', component: MlFeasibilityTestComponent }
    ]
  }
];

@NgModule({
  declarations: [
    MlTestingDashboardComponent,
    MlMatchingTestComponent,
    MlPrixTestComponent,
    MlProfilTestComponent,
    MlFeasibilityTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MlTestingModule { }
