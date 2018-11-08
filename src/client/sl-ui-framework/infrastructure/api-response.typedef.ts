import { Completion } from './completion.typedef';

/**
 * Model for Api Response.
 * 
 * @export
 * @class ApiResponse
 * @template T
 */
export class ApiResponse<T> {
    completion: Completion;
    data: T;
}

