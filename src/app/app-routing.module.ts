import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@/pages/home/home.component';
import { NotFoundComponent } from '@/pages/not-found/not-found.component';
import { HealthcareRatesComponent } from './pages/healthcare-rates/healthcare-rates.component';
import { TeacherPayScheduleComponent } from './pages/teacher-pay-schedule/teacher-pay-schedule.component';

const baseSiteTitle = "HHH Employee Benefits";
const getRoutePageTitle = (pathTitle?: string) => {
  if (pathTitle !== undefined) {
    return `${baseSiteTitle} - ${pathTitle}`;
  }
  return baseSiteTitle;
};

const routes: Routes = [
  { path: "Home", redirectTo: '', pathMatch: 'full' },

  { path: "", component: HomeComponent, title: getRoutePageTitle() },
  { path: "Healthcare-Rates", component: HealthcareRatesComponent, title: getRoutePageTitle("Healthcare Deduction Calculator") },
  { path: "Teacher-Pay-Schedule", component: TeacherPayScheduleComponent, title: getRoutePageTitle("Teacher Pay Schedule") },
  { path: "404", component: NotFoundComponent, title: getRoutePageTitle("404 Page Not Found") },

  { path: "**", redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
