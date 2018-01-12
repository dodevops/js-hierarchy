/**
 * @module js-hierarchy
 */
/**
 */
import {Node} from '../Node';

/**
 * Invalid node found
 */
export class InvalidNodeError extends Error implements Error {

    public name: string = 'InvalidNodeError';

    constructor(child: Node) {
        super(`Invalid Node ${child.toJSON()}`);
    }
}
