/**
 * A walker, that runs all parents children from the current
 * child to the right.
 */
import {Walker} from './Walker';
import {ActionFunction} from '../ActionFunction';
import {Node} from '../Node';

/**
 * A walker, that runs all parents children from the current
 * child to the right.
 */
export class RightWalker implements Walker {

    public walk(node: Node, action: ActionFunction): void {
        let parent: Node = node.getParent();

        for (let i = parent.findChild(node) + 1; i < parent.getChildren().length; i++) {
            action(parent.getChildren()[i]);
        }
    }
}
