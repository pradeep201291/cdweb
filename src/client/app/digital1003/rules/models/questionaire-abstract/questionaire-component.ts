import { EventEmitter } from '@angular/core';
import { Questionaire } from './questionaire.typedef';

/**
 * An abstraction for the dumb components to be loaded in Digital 1003
 * 
 * @export
 * @abstract
 * @class QuestionaireComponent
 * @template T 
 */
export abstract class QuestionaireComponent<T extends Questionaire> {
    abstract input: T;
    abstract output: EventEmitter<T>;
}
