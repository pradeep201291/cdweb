import { ErrorHandler } from '@angular/core';

export class AppErrorHandler extends ErrorHandler {
 constructor() {
   super(true);
 }
  handleError(error: any) {
   super.handleError(error);
  }
}
