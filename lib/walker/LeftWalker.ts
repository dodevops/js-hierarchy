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

    public walk(node: Node, action: ActionFunction): void {
        let parent: Node = node.getParent();

        for (let i = parent.findChild(node) - 1; i >= 0; i--) {
            action(parent.getChildren()[i]);
        }
    }
}
