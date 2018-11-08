import { ViewContainerRef, Directive, ComponentFactoryResolver, ComponentRef, Type, EventEmitter } from '@angular/core';
import { Questionaire } from './rules/models/questionaire-abstract/questionaire.typedef';

import { QuestionaireComponent } from './rules/models/questionaire-abstract/questionaire-component';
@Directive({
    selector: '[digital1003-host]'
})
export class Digital1003HostDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    /**
     * 
     * 
     * @param {{ new (): any }} component 
     * @returns {ComponentRef<any>} 
     * 
     * @memberOf Digital1003HostDirective
     */
    createComponent(componentToBeLoaded: Type<QuestionaireComponent<Questionaire>>,
        input: Questionaire,
        callBack: (x: Questionaire) => void): ComponentRef<any> {
        this.viewContainer.clear();

        let ComponentFactory = this.componentFactoryResolver.resolveComponentFactory(componentToBeLoaded);
        let componentRef = this.viewContainer.createComponent(ComponentFactory);
        // componentArgs._modelProperty.subscribe(value => {
        //     componentRef.instance.input = value;
        // });
        componentRef.instance.input = input;
        componentRef.instance.output = new EventEmitter<Questionaire>();
        componentRef.instance.output.subscribe(callBack);
        return componentRef;
    }

    /**
     * 
     * 
     * @param {ComponentRef<any>} componentRef 
     * 
     * @memberOf Digital1003HostDirective
     */
    destroyComponent(componentRef: ComponentRef<any>) {
        // componentRef.instance.toggle.subscribe(() => {
        //     componentRef.destroy();
        // });
    }
}
