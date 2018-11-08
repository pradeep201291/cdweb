import { Injectable } from '@angular/core';
import * as nprogress from 'nprogress';


/**
 * A service for Progress bar
 */
@Injectable()
export class ProgressBarService {
    private requestsInProgress: number = 0;
    private requestsCompleted: number = 0;

    enqueue() {
        this.requestsInProgress += 1;
        let progress = (this.requestsCompleted / this.requestsInProgress);
        nprogress.set(progress);
    }

    dequeue() {
        this.requestsCompleted += 1;
        let progress = (this.requestsCompleted / this.requestsInProgress);
        nprogress.set(progress);
    }

    reset() {
        this.requestsCompleted = 0;
        this.requestsInProgress = 0;
        nprogress.set(0);
    }
}
