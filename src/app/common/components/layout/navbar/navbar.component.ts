import { INavbarDataService, NavbarData } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private navbarDataSubscription: Subscription | undefined;
  navbarData: NavbarData | undefined;

  constructor(private _navbarDataService: INavbarDataService) {
    this.navbarData = undefined;
  }

  ngOnInit() {
    this.navbarDataSubscription = this._navbarDataService.GetNavbarDataSubject()
    .subscribe((navbarData: NavbarData) => {
      this.navbarData = navbarData;
    })
  }

  ngOnDestroy() {
    this.navbarDataSubscription?.unsubscribe();
  }
}
