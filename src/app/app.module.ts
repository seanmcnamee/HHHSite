import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@/app/app-routing.module';
import { AppComponent } from '@/app/app.component';
import { NavbarComponent } from '@/common/components/layout/navbar/navbar.component';
import { ErrorAlertsComponent } from '@/common/components/error-alerts/error-alerts.component';
import { IErrorAlertsService } from '@/common/services/error-alerts/error-alerts.service.interface';
import { ErrorAlertsService } from '@/common/services/error-alerts/error-alerts.service';
import { HomeComponent } from '@/pages/home/home.component';
import { NotFoundComponent } from '@/pages/not-found/not-found.component';
import { FooterComponent } from '@/common/components/layout/footer/footer.component';
import { TeacherPayScheduleComponent } from '@/pages/teacher-pay-schedule/teacher-pay-schedule.component';
import { HealthcareRatesComponent } from '@/pages/healthcare-rates/healthcare-rates.component';
import { IHealthcareRatesService } from '@/common/services/healthcare-rates/healthcare-rates.service.interface';
import { HealthcareRatesService } from '@/common/services/healthcare-rates/healthcare-rates.service';
import { FormsModule } from '@angular/forms';
import { DeductionResultsComponent } from '@/pages/healthcare-rates/deduction-results/deduction-results.component';
import { NavbarDataService } from '@/common/services/navbar-data/navbar-data.service';
import { INavbarDataService } from '@/common/services/navbar-data/navbar-data.service.interface';
import { ITeacherPayScheduleService } from '@/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { TeacherPayScheduleService } from '@/common/services/teacher-pay-schedule/teacher-pay-schedule.service';
import { PayBreakdownResultsComponent } from './pages/teacher-pay-schedule/pay-breakdown-results/pay-breakdown-results.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ErrorAlertsComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    TeacherPayScheduleComponent,
    HealthcareRatesComponent,
    DeductionResultsComponent,
    PayBreakdownResultsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: IErrorAlertsService, useClass: ErrorAlertsService},
    {provide: IHealthcareRatesService, useClass: HealthcareRatesService},
    {provide: INavbarDataService, useClass: NavbarDataService},
    {provide: ITeacherPayScheduleService, useClass: TeacherPayScheduleService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
