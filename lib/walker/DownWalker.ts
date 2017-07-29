/**
 * A walker, that climbs the hierarchy down
 */
import {Walker} from './Walker';
import {Node} from '../Node';
import {ActionFunction} from '../ActionFunction';

/**
 * A walker, that climbs the hierarchy down
 */
export class DownWalker implements Walker {

    walk(node: Node, action: ActionFunction): void {
        for (let childNode of node.getChildren()) {
            action(childNode);
            this.walk(childNode, action);
        }
    }

}