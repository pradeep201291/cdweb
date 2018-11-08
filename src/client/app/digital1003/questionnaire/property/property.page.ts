import { Component, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';

import { PropertyQuestionaire } from './../../rules/models/property-questionaire.typedef';
import { ruleServiceProvider, RuleProvider } from './../../rules/rule-provider';
import { BusinessRule } from './../../rules/business-rule';

import { Digital1003HostDirective } from '../../digital1003-host-directive';
@Component({
    selector: 'sl-property-page',
    templateUrl: './property.page.html',
    providers: [ruleServiceProvider]
})

export class PropertyPage implements OnInit {
    private rules: BusinessRule<PropertyQuestionaire>;
    @ViewChild(Digital1003HostDirective) hostDirective: Digital1003HostDirective;

    constructor(private ruleProvider: RuleProvider,
        private _componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        let propertyQuestionaire = new PropertyQuestionaire();
        propertyQuestionaire.questionId = 1;
        // propertyQuestionaire.isIdentified = true;
        // propertyQuestionaire.questionId = 5;
        // propertyQuestionaire.testOtherProperty = false;
        // propertyQuestionaire.testProperty = true;

        this.rules = this.ruleProvider.getRulesFor(propertyQuestionaire);
        this.submit(propertyQuestionaire);
        // rules.executeRules(propertyQuestionaire);
    }

    submit(propertyQuestionaire: PropertyQuestionaire) {
        let componentLoadArgs = this.rules.executeRules(propertyQuestionaire);
        if (componentLoadArgs) {
            console.log(propertyQuestionaire);
            if (componentLoadArgs._modelProperty) {
                componentLoadArgs._modelProperty.subscribe(questionaire => {
                    this.hostDirective.createComponent(componentLoadArgs._questionaireComponent, questionaire, this.callBack.bind(this));
                });
            } else {
                this.hostDirective
                    .createComponent(componentLoadArgs._questionaireComponent, propertyQuestionaire, this.callBack.bind(this));

            }

        }
    }

    private callBack(propertyQuestionaire: PropertyQuestionaire) {
        console.log(propertyQuestionaire);
        this.submit(propertyQuestionaire);
    }
}
