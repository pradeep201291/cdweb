import { QuestionaireComponent } from './questionaire-component';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { Questionaire } from './questionaire.typedef';

/**
 * This class encapsulates the component Loading argumments.
 * 
 * @export
 * @class QuestionaireComponentLoadArgs
 */
export class QuestionaireComponentLoadArgs {
    /**
     * 
     * 
     * @type {Type<QuestionaireComponent<Questionaire>>}
     * @memberOf QuestionaireComponentLoadArgs
     */
    _questionaireComponent: Type<QuestionaireComponent<Questionaire>>;

    /**
     * 
     * 
     * 
     * @memberOf QuestionaireComponentLoadArgs
     */
    _modelProperty: Observable<Questionaire>;

    /**
     * Creates an instance of QuestionaireComponentLoadArgs.
     * @param {Type<QuestionaireComponent<Questionaire>>} questionaireComponent 
     * @param {(arg: Questionaire) => Observable<Questionaire>} modelProperty 
     * 
     * @memberOf QuestionaireComponentLoadArgs
     */
    constructor(questionaireComponent: Type<QuestionaireComponent<Questionaire>>,
        modelProperty: Observable<Questionaire>) {
        this._questionaireComponent = questionaireComponent;
        this._modelProperty = modelProperty;
    }
}
