import { PropertyRuleComposer } from './../questionnaire/property/property-rules/property-rules';
import { Questionaire } from './models/questionaire-abstract/questionaire.typedef';
import { BusinessRule } from './business-rule';
/**
 * The Rule Provider
 * 
 * @export
 * @class RuleProvider
 */
export class RuleProvider {
    /**
     * 
     * 
     * @private
     * 
     * @memberOf RuleProvider
     */
    private propertyRules = new PropertyRuleComposer();

    /**
     * Creates an instance of RuleProvider.
     * 
     * 
     * @memberOf RuleProvider
     */
    constructor() {

    }

    /**
     * Gets the rule for the object type.
     * 
     * @template T
     * @param {T} instance
     * @returns {BusinessRule<Questionaire>}
     * 
     * @memberOf RuleProvider
     */
    getRulesFor<T extends Questionaire>(instance: T): BusinessRule<Questionaire> {
        switch (instance.constructor.name.toUpperCase()) {
            case 'PROPERTYQUESTIONAIRE': return this.propertyRules;
        }
    }
}



export let ruleServiceProvider = {
    provide: RuleProvider,
    useFactory: () => new RuleProvider(),
};
