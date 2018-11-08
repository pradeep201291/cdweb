import { ExpressionNode } from './expression-node';
import { ThenOperation } from './then-operation';
/**
 * THe Rule Operations.
 * 
 * @class RuleOperations
 * @template T
 */
export class RuleOperations<T> {
    private expressionTree: ExpressionNode<T>;

    /**
     * Creates an instance of RuleOperations.
     * 
     * @param {ExpressionNode<T>} expressionTree
     * 
     * @memberOf RuleOperations
     */
    constructor(expressionTree: ExpressionNode<T>) {
        this.expressionTree = expressionTree;
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf RuleOperations
     */
    isSelected() {
        this.expressionTree.secondExpressionToBeEvaluated = ((x: T) => true);
        return new ThenOperation(this.expressionTree);
    }

    isEqualTo(valueExpression: () => any) {
        this.expressionTree.secondExpressionToBeEvaluated = valueExpression;
        return new ThenOperation(this.expressionTree);
    }

}
