import { ErrorAlertItem, IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private _navbarDataService: INavbarDataService) { }

  ngOnInit(): void {
    this._navbarDataService.SetNavbarData({
      pageTitle: "Calculations Hub",
      pageSubTitle: undefined,
      showNavLinks: true
    });
  }
  ngOnDestroy(): void {
    this._navbarDataService.ClearNavbarData();
  }
}
