import { Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Questionaire } from '../questionaire-abstract/questionaire.typedef';
import { QuestionaireComponent } from '../questionaire-abstract/questionaire-component';

/**
 * A Model for expression.
 * 
 * @class ExpressionNode
 * @template T
 */
export class ExpressionNode<T> {
    firstExpressionToBeEvaluated: (args: T) => any;
    secondExpressionToBeEvaluated: (args: T) => any;
    componentToBeLoaded: () => Type<QuestionaireComponent<Questionaire>>;
    updateDependecies: (arg: T) => Observable<T>;
}
