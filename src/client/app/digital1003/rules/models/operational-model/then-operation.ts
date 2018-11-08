import { Type } from '@angular/core';
import { ExpressionNode } from './expression-node';
import { QuestionaireComponent } from '../questionaire-abstract/questionaire-component';
import { Questionaire } from '../questionaire-abstract/questionaire.typedef';
import { DepedencyLoader } from './dependency-loader';
/**
 * The Then Operation.
 * 
 * @class ThenOperation
 * @template T
 */
export class ThenOperation<T>{
    private expressionTree: ExpressionNode<T>;

    constructor(expressionTree: ExpressionNode<T>) {
        this.expressionTree = expressionTree;
    }

    /**
     * 
     * 
     * 
     * @memberOf ThenOperation
     */
    loadComponent(componentLoadExpression: () => Type<QuestionaireComponent<Questionaire>>) {
        console.log('I am here..');
        this.expressionTree.componentToBeLoaded = componentLoadExpression;
        return new DepedencyLoader(this.expressionTree);
    }
}
