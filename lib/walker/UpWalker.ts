/**
 * A walker, that climbs the hierarchy up
 */
import {Walker} from './Walker';
import {Node} from '../Node';
import {ActionFunction} from '../ActionFunction';
import * as loglevel from 'loglevel';

/**
 * A walker, that climbs the hierarchy up
 */
export class UpWalker implements Walker {

    public walk(node: Node, action: ActionFunction): void {
        let log: Log = loglevel.getLogger('js-hierarchy:UpWalker');
        if (log.getLevel() === LogLevel.TRACE) {
            log.trace(`Walking node ${node.toJSON()}`);
        }
        for (let childNode of node.getChildren()) {
            log.trace(`Calling action child node.`);
            action(childNode);
            this.walk(childNode, action);
        }
    }

}
