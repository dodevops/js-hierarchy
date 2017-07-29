/**
 * A walker, that runs all parents children from the current
 * child to the left.
 */
import {Walker} from './Walker';
import {ActionFunction} from '../ActionFunction';
import {Node} from '../Node';

/**
 * A walker, that runs all parents children from the current
 * child to the left.
 */
export class LeftWalker implements Walker {

    walk(node: Node, action: ActionFunction): void {
        // find index of this node

        let parent: Node = node.getParent();

        for (let i = parent.findChild(node) - 1; i > 0; i--) {
            action(parent.getChildren()[i]);
        }
    }
}