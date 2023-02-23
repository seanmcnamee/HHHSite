import { Subject } from "rxjs";

export abstract class INavbarDataService {
  constructor() { }  
  public abstract GetNavbarDataSubject(): Subject<NavbarData>;
  public abstract SetNavbarData(navbarData: NavbarData): void;
  public abstract ClearNavbarData(): void;
}

export interface NavbarData {
  pageTitle: string | undefined;
  showNavLinks: boolean;
  pageSubTitle: string | undefined;
}