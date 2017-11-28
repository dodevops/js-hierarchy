/**
 * A walker, that runs all parents children from the current
 * child to the right.
 */
import {Walker} from './Walker';
import {ActionFunction} from '../ActionFunction';
import {Node} from '../Node';
import * as loglevel from 'loglevel';
import Bluebird = require('bluebird');

/**
 * A walker, that runs all parents children from the current
 * child to the right.
 */
export class RightWalker implements Walker {

    public walk(node: Node, action: ActionFunction): Bluebird<void> {
        let log = loglevel.getLogger('js-hierarchy:LeftWalker');

        let parent: Node = node.getParent();

        let nodes: Array<Node> = [];

        for (
            let i = parent.findChild(node) + 1;
            i < parent.getChildren().length;
            i++
        ) {
            nodes.push(parent.getChildren()[i]);
        }

        return Bluebird.reduce(
            nodes,
            (total, current) => {
                if (log.getLevel() === log.levels.TRACE) {
                    log.trace(`Calling action on child: ${current.toJSON()}`);
                }
                return action(current)
                    .thenReturn([]);
            },
            []
        ).thenReturn();
    }
}
