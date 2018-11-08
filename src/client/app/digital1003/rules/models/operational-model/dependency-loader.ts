import { Observable } from 'rxjs/Observable';
import { ExpressionNode } from './expression-node';
import { RuleName } from './rule-name';
export class DepedencyLoader<T>{
    private expressionTree: ExpressionNode<T>;

    constructor(expressionTree: ExpressionNode<T>) {
        this.expressionTree = expressionTree;
    }

    updateDependencies(componentLoadExpression: (arg: T) => Observable<T>) {
        console.log('I am here..');
        this.expressionTree.updateDependecies = componentLoadExpression;
        return new RuleName(this.expressionTree);
    }
}
