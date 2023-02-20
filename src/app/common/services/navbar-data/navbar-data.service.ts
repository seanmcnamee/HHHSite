import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INavbarDataService, NavbarData } from './navbar-data.service.interface';

@Injectable({
  providedIn: 'root'
})
export class NavbarDataService implements INavbarDataService {
  private navbarData: Subject<NavbarData> = new Subject<NavbarData>();

  constructor() { }

  public GetNavbarDataSubject(): Subject<NavbarData> {
    return this.navbarData;
  }
  public SetNavbarData(navbarData: NavbarData): void {
    this.navbarData.next(navbarData);
  }
  public ClearNavbarData(): void{
    this.SetNavbarData({
      pageTitle: undefined,
      pageSubTitle: undefined,
      showNavLinks: false
    });
  }
}
