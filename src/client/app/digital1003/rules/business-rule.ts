import { ExpressionNode } from './models/operational-model/expression-node';
import { Questionaire } from './models/questionaire-abstract/questionaire.typedef';
import { QuestionaireComponentLoadArgs } from './models/questionaire-abstract/questionaire-componentLoadArgs';
import { WhenExpressionNode } from './models/operational-model/when-expression-node';
import { RuleOperations } from './models/operational-model/rule-operations';
/**
 * An Abstraction for business rule.
 * 
 * @export
 * @abstract
 * @class BusinessRule
 * @template T
 */
export abstract class BusinessRule<T extends Questionaire>{

    /**
     * The expression tree.
     * 
     * @type {WhenExpressionNode<T>}
     * @memberOf BusinessRule
     */
    expressionTree: WhenExpressionNode<T>;

    /**
     * The rules.
     * 
     * @type {ExpressionNode<T>[]}
     * @memberOf BusinessRule
     */
    rules: ExpressionNode<T>[] = [];

    /**
     * Creates an instance of BusinessRule.
     * 
     * 
     * @memberOf BusinessRule
     */
    constructor() {
        this.configureRules();
    }

    /**
     * An abstract method for configuring the rules;
     * 
     * @abstract
     * 
     * @memberOf BusinessRule
     */
    abstract configureRules(): void;

    /**
     * 
     * 
     * @param {(args: T) => any} expression
     * @returns
     * 
     * @memberOf BusinessRule
     */
    when(expression: (args: T) => any) {
        this.expressionTree = new WhenExpressionNode<T>(expression);
        this.rules.push(this.expressionTree);
        return new RuleOperations<T>(this.expressionTree);
    }


    /**
     * 
     * 
     * @param {T} entity
     * 
     * @memberOf BusinessRule
     */
    executeRules(entity: T): QuestionaireComponentLoadArgs {
        for (let rule of this.rules) {
            let firstExpression = rule.firstExpressionToBeEvaluated;
            let secondExpression = rule.secondExpressionToBeEvaluated;

            if (firstExpression(entity) === secondExpression(entity)) {
                // console.log(`The rule - ${rule.ruleName} successful`);
                /** If there are any dependencies to be loaded then */
                // return rule.componentToBeLoaded(entity);
                if (rule.updateDependecies) {
                    return new QuestionaireComponentLoadArgs(rule.componentToBeLoaded(), rule.updateDependecies(entity));
                }
                return new QuestionaireComponentLoadArgs(rule.componentToBeLoaded(), null);
            }

        }
    }
}
