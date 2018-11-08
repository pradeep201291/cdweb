import { Questionaire } from './questionaire-abstract/questionaire.typedef';

/**
 * Properties for Form Data - Property Questionaire
 * 
 * @export
 * @class PropertyQuestionaire
 * @extends {Questionaire}
 */
export class PropertyQuestionaire extends Questionaire {
    get IsPropertyIdentified(): boolean {
        return this.isPropertyIdentified && this.questionId === 1;
    }

    get IsPropertyNotIdentified(): boolean {
        return this.isPropertyIdentified === false && this.questionId === 1;
    }

    get isPropertySelectionNotMade(): boolean {
        return this.isPropertyIdentified === undefined;
    }

    isPropertyIdentified: boolean;
    testProperty: boolean;
    testOtherProperty: boolean;
}
