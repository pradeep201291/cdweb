import { ExpressionNode } from './expression-node';
/**
 * The Rule Name.
 * 
 * @class RuleName
 * @template T
 */
export class RuleName<T>{
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
    setRuleNameAs(ruleName: string) {
        // this.expressionTree.ruleName = ruleName;
    }
}
