import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { TaskInfo } from './../../summary/summary.typedef';
import { Need } from './../../dashboard/needlist/needlist.typedef';

@Injectable()
export class EsignModalService {
    /**
     * @desc {summary}
     */
    private esignURLSubject = new Subject<TaskInfo>();

    /**
     * @desc {dashboard}
     */
    private esignSubject = new Subject<Need>();


    /**
    * @desc {summary}
    */
    setEsignTask(esignTask: TaskInfo) {
        this.esignURLSubject.next(esignTask);
    }
    /**
    * @desc {summary}
    */
    getEsignTask(): Observable<TaskInfo> {
        return this.esignURLSubject.asObservable();
    }


    /**
    * @desc {dashboard}
    */
    setTask(esignTask: Need) {
        this.esignSubject.next(esignTask);
    }
    /**
    * @desc {dashboard}
    */
    getTask(): Observable<Need> {
        return this.esignSubject.asObservable();
    }
}
