import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorAlertItem, IErrorAlertsService } from './error-alerts.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorAlertsService implements IErrorAlertsService {
  private errorItems: ErrorAlertItem[] = [];
  private errorItemsChanged: Subject<ErrorAlertItem[]> = new Subject<ErrorAlertItem[]>();

  constructor() { }

  public GetErrorAlertItemsSubject(): Subject<ErrorAlertItem[]> {
    return this.errorItemsChanged;
  }

  public AddErrorAndBroadcast(item: ErrorAlertItem): void {
    this.errorItems.unshift(item);
    this.errorItemsChanged.next(this.errorItems);

    //Setup auto-dismiss after autoDismissDelay ms
    // No autoDismissDelay means no auto-dismiss
    if (item.autoDismissDelay > 0) {
      setTimeout(() => {
        if (this.errorItems.includes(item)) { //Ensure item hasn't been user-dismissed
          this.dismissItem(item)
        }
      },
        item.autoDismissDelay);
    }
  }

  public dismissItem(item: ErrorAlertItem): void {
    item.isDismissing = true;
    this.errorItemsChanged.next(this.errorItems);

    //Setup removal after dismissFadeTime ms
    setTimeout(() => {
      
      if (this.errorItems.includes(item)) { //Ensure item hasn't been user-dismissed
        this.RemoveErrorAndBroadcast(item)
      }
    },
      (item.dismissFadeTime > 0) ? item.dismissFadeTime : 0); //No dismissFadeTime means immediately remove
  }

  public RemoveErrorAndBroadcast(item: ErrorAlertItem) {
    var indexOfItem = this.errorItems.indexOf(item);
    if (indexOfItem >= 0) {  //Ensure item hasn't been user-dismissed
      this.errorItems.splice(this.errorItems.indexOf(item), 1);
      this.errorItemsChanged.next(this.errorItems);
      item.onRemove(item); //Removal callback
    }
  }

  
  public ClearErrorsWithScope(scope: string) {
    const errorItemsToRemove = this.errorItems.filter(item => item.scope === scope);
    errorItemsToRemove.forEach(item => this.RemoveErrorAndBroadcast(item));
  }
}
