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

    public walk(node: Node, action: ActionFunction): void {
        if (!node.isRoot()) {
            action(node.getParent());
            this.walk(node.getParent(), action);
        }
    }

}
