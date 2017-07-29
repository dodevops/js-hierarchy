/**
 * A interface for a Walker implementation
 */
import {ActionFunction} from '../ActionFunction';
import {Node} from '../Node';

/**
 * A interface for a Walker implementation
 */
export interface Walker {
    /**
     * Walk the given node and call the action function on each encountered
     * node.
     * @param {Node} node
     * @param {ActionFunction} action
     */
    walk(node: Node, action: ActionFunction): void;
}
