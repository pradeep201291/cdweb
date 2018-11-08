import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { FormWidgetData } from '../../dashboard/dashboard.typedef';

/**
 * 
 * 
 * @export
 * @class WidgetRenderService
 */
@Injectable()
export class WidgetRenderService {
    /**
     * @desc form free widget subject for dashboard
     * 
     * @private
     * 
     * @memberOf WidgetRenderService
     */
    private widgetRenderSubject = new Subject<FormWidgetData>();

    /**
     * @desc form free widget subject for summary
     * 
     * @private
     * 
     * @memberOf WidgetRenderService
     */
    private formRenderSubject = new Subject<FormWidgetData>();

    /**
     * set widget data from needlist component
     * 
     * @param {FormWidgetData} formData
     * 
     * @memberOf WidgetRenderService
     */
    setWidgetContent(formData: FormWidgetData) {
        this.widgetRenderSubject.next(formData);
    }
    /**
     * @desc returns widget data to dashboad
     * 
     * @returns {Observable<FormWidgetData>}
     * 
     * @memberOf WidgetRenderService
     */
    getWidgetContent(): Observable<FormWidgetData> {
        return this.widgetRenderSubject.asObservable();
    }

    /**
     * set widget data from asset verification component
     * 
     * @param {FormWidgetData} formData
     * 
     * @memberOf WidgetRenderService
     */
    setFormContent(formData: FormWidgetData) {
        this.formRenderSubject.next(formData);
    }

    /**
     * @desc returns widget data to summary
     * 
     * @returns {Observable<FormWidgetData>}
     * 
     * @memberOf WidgetRenderService
     */
    getFormContent(): Observable<FormWidgetData> {
        return this.formRenderSubject.asObservable();
    }
}
