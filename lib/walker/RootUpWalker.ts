/**
 * @module js-hierarchy
 */
/**
 */
import {Walker} from './Walker';
import {Node} from '../Node';
import {ActionFunction} from '../ActionFunction';
import * as loglevel from 'loglevel';
import Bluebird = require('bluebird');

/**
 * A walker, that climbs the hierarchy down to the root and then back up calling each node
 */
export class RootUpWalker implements Walker {

    public walk(node: Node, action: ActionFunction): Bluebird<void> {
        let log = loglevel.getLogger('js-hierarchy:DownWalker');
        if (log.getLevel() === log.levels.TRACE) {
            log.trace(`Walking node ${node.toJSON()}`);
        }

        if (!node.isRoot()) {
            log.trace('Have not reached root. Calling action.');
            log.trace('Walking further down.');
            return this.walk(node.getParent(), action)
                .then(
                    () => {
                        return action(node)
                            .thenReturn();
                    }
                );
        }

        return action(node)
            .thenReturn();
    }

}
