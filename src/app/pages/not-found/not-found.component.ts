import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  constructor(private _navbarDataService: INavbarDataService) { }
  
  ngOnInit(): void {
    this._navbarDataService.SetNavbarData({
      pageTitle: undefined,
      pageSubTitle: undefined,
      showNavLinks: false
    });
  }
  ngOnDestroy(): void {
    this._navbarDataService.ClearNavbarData();
  }
}
