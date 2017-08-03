/**
 * A walker, that climbs the hierarchy down
 */
import {Walker} from './Walker';
import {Node} from '../Node';
import {ActionFunction} from '../ActionFunction';
import * as loglevel from 'loglevel';

/**
 * A walker, that climbs the hierarchy down
 */
export class DownWalker implements Walker {

    public walk(node: Node, action: ActionFunction): void {
        let log: Log = loglevel.getLogger('js-hierarchy:DownWalker');
        if (log.getLevel() === LogLevel.TRACE) {
            log.trace(`Walking node ${node.toJSON()}`);
        }

        if (!node.isRoot()) {
            log.trace('Have not reached root. Calling action.');
            action(node.getParent());
            log.trace('Walking further down.');
            this.walk(node.getParent(), action);
        }
    }

}
