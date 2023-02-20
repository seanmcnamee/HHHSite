import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorAlertItem, IErrorAlertsService } from 'src/app/common/services/error-alerts/error-alerts.service.interface';

@Component({
  selector: 'app-error-alerts',
  templateUrl: './error-alerts.component.html',
  styleUrls: ['./error-alerts.component.scss']
})
export class ErrorAlertsComponent implements OnDestroy {
  errorAlerts: ErrorAlertItem[] = [];
  private subscription: Subscription;

  constructor(private _errorAlertsService: IErrorAlertsService) {
    this.subscription = _errorAlertsService.GetErrorAlertItemsSubject().subscribe(
      newErrorAlerts => {
        this.errorAlerts = newErrorAlerts
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onDismissal(item: ErrorAlertItem) {
    this._errorAlertsService.RemoveErrorAndBroadcast(item);
  }
}