import { ExpressionNode } from './expression-node';
/**
 * The Rule Expression Node.
 * 
 * @class RuleExpressionNode
 * @extends {ExpressionNode<T>}
 * @template T
 */
export class RuleExpressionNode<T> extends ExpressionNode<T> {

    /**
     * Creates an instance of RuleExpressionNode.
     * 
     * @param {(args: T) => any} expressionToBeEvaluated
     * 
     * @memberOf RuleExpressionNode
     */
    constructor(expressionToBeEvaluated: (args: T) => any) {
        super();
        this.secondExpressionToBeEvaluated = expressionToBeEvaluated;
    }
}
