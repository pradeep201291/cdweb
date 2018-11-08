import { ExpressionNode } from './expression-node';
/**
 * The When Expression
 * 
 * @class WhenExpressionNode
 * @extends {ExpressionNode<T>}
 * @template T
 */
export class WhenExpressionNode<T> extends ExpressionNode<T> {

    /**
     * Creates an instance of WhenExpressionNode.
     * 
     * @param {(args: T) => any} expressionToBeEvaluated
     * 
     * @memberOf WhenExpressionNode
     */
    constructor(expressionToBeEvaluated: (args: T) => any) {
        super();
        this.firstExpressionToBeEvaluated = expressionToBeEvaluated;
    }
}
