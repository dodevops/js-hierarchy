/**
 * A walker, that runs all parents children from the current
 * child to the left.
 */
import {Walker} from './Walker';
import {ActionFunction} from '../ActionFunction';
import {Node} from '../Node';
import * as loglevel from 'loglevel';

/**
 * A walker, that runs all parents children from the current
 * child to the left.
 */
export class LeftWalker implements Walker {

    public walk(node: Node, action: ActionFunction): void {
        let log: Log = loglevel.getLogger('js-hierarchy:LeftWalker');

        let parent: Node = node.getParent();

        for (let i = parent.findChild(node) - 1; i >= 0; i--) {
            if (log.getLevel() === LogLevel.TRACE) {
                log.trace(`Calling action on child #${i}: ${parent.getChildren()[i].toJSON()}`);
            }
            action(parent.getChildren()[i]);
        }
    }
}
