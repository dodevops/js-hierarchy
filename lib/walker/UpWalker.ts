/**
 * A walker, that climbs the hierarchy up
 */
import {Walker} from './Walker';
import {Node} from '../Node';
import {ActionFunction} from '../ActionFunction';

/**
 * A walker, that climbs the hierarchy up
 */
export class UpWalker implements Walker {

    public walk(node: Node, action: ActionFunction): void {
        for (let childNode of node.getChildren()) {
            action(childNode);
            this.walk(childNode, action);
        }
    }

}
