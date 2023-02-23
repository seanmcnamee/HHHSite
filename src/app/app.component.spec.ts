import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '@/app/app.component';
import { NavbarComponent } from '@/common/components/layout/navbar/navbar.component';
import { FooterComponent } from '@/common/components/layout/footer/footer.component';
import { INavbarDataService } from '@/common/services/navbar-data/navbar-data.service.interface';
import { NavbarDataService } from '@/common/services/navbar-data/navbar-data.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [AppComponent, NavbarComponent, FooterComponent],
      providers: [
        { provide: INavbarDataService, useClass: NavbarDataService },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'HHHSite'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('HHHSite');
  });
});
