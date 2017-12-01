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
 * A walker, that climbs the hierarchy up
 */
export class UpWalker implements Walker {

    public walk(node: Node, action: ActionFunction): Bluebird<void> {
        let log = loglevel.getLogger('js-hierarchy:UpWalker');
        if (log.getLevel() === log.levels.TRACE) {
            log.trace(`Walking node ${node.toJSON()}`);
        }
        return Bluebird.reduce(
            node.getChildren(),
            (total, current) => {
                log.trace(`Calling action child node.`);
                return action(current)
                    .then(
                        () => {
                            return this.walk(current, action);
                        }
                    ).thenReturn([]);
            },
            []
        )
            .thenReturn();
    }

}
