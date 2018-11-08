import { BusinessRule } from './../../../rules/business-rule';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { PropertyIdentify } from './../property-identify/property-identify.component';
import { PropertyAddress } from './../property-address/property-address.component';
import { InterestedCityState } from './../interested-city-state/interested-city-state.component';
import { Observable } from 'rxjs';
export class PropertyRuleComposer extends BusinessRule<PropertyQuestionaire> {
    /**
     * Creates an instance of PropertyRuleComposer.
     * 
     * 
     * @memberOf PropertyRuleComposer
     */
    constructor() {
        super();
    }

    /**
     * Configures the rules.
     * 
     * 
     * @memberOf PropertyRuleComposer
     */
    configureRules() {
        // this.when(p => p.IsIdentified).isSelected().then().setRuleNameAs('Rule-1');
        // this.when(p => p.testProperty).isSelected().then().setRuleNameAs('Rule-2');
        // this.when(p => p.testOtherProperty).isSelected().then().setRuleNameAs('Rule-3');
        this.when(p => p.IsPropertyIdentified)
            .isEqualTo(() => true)
            .loadComponent(() => PropertyAddress)
            .updateDependencies((p) => {
                p.questionId = 3;
                return Observable.of(p);
            });



        this.when(p => p.IsPropertyNotIdentified)
            .isEqualTo(() => true)
            .loadComponent(() => InterestedCityState)
            .updateDependencies(p => {
                p.questionId = 2;
                return Observable.of(p);
            });


        this.when(p => p.isPropertySelectionNotMade)
            .isEqualTo(() => true).loadComponent(() => PropertyIdentify);


    }
}
