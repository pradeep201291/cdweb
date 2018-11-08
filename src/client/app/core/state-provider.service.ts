import { Injectable } from '@angular/core';

@Injectable()
/**
 * This service is used for sharing state across the application.
 */
export class StateProviderService {
  /**
    * @public
    * @type {string}
    * @memberOf StateProviderService
    */
  needListUploadEntryRoute: string = '/summary';

  /**
   * 
   * 
   * @private
   * @type {string}
   * @memberOf StateProviderService
   */
  private _loanOfficerName: string;
  set loanOfficerName(value: string) {
    this._loanOfficerName = value;
  }
  get loanOfficerName(): string {
    return this._loanOfficerName;
  }

  /**
   * 
   * 
   * @private
   * @type {string}
   * @memberOf StateProviderService
   */
  private _needId: string;
  set NeedId(value: string) {
    this._needId = value;
  }
  get NeedId(): string {
    return this._needId;
  }

}
