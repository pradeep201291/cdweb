import { QueryEncoder } from '@angular/http';

/**
 * 
 * 
 * @class Encoder
 * @extends {QueryEncoder}
 */
export class Encoder extends QueryEncoder {
    /**
     * 
     * 
     * @param {string} k
     * @returns {string}
     * 
     * @memberOf Encoder
     */
    encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    /**
     * 
     * 
     * @param {string} v
     * @returns {string}
     * 
     * @memberOf Encoder
     */
    encodeValue(v: string): string {
        v = super.encodeKey(v);
        return v.replace(/\+/gi, '%2B');
    }
}
