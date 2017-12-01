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
 * A walker, that climbs the hierarchy down
 */
export class DownWalker implements Walker {

    public walk(node: Node, action: ActionFunction): Bluebird<void> {
        let log = loglevel.getLogger('js-hierarchy:DownWalker');
        if (log.getLevel() === log.levels.TRACE) {
            log.trace(`Walking node ${node.toJSON()}`);
        }

        return action(node)
            .then(
                () => {
                    if (!node.isRoot()) {
                        log.trace('Have not reached root. Walking further down.');
                        return this.walk(node.getParent(), action);
                    } else {
                        return Bluebird.resolve();
                    }
                }
            );
    }

}
