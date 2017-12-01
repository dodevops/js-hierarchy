/**
 * @module Test
 */
/**
 * Utility ressources for tests
 */

import {SimpleNode} from '../lib/SimpleNode';

/**
 * Create a hierarchy for tests
 * @returns {SimpleNode}
 */
export function makeTestHierarchy(): SimpleNode {
    let rootNode = new SimpleNode({ name: 'root' });
    rootNode.addChild(
        new SimpleNode({ name: 'test1' })
    );
    rootNode.addChild(
        new SimpleNode({ name: 'test2'})
    );
    let testNode3 = new SimpleNode({ name: 'test3' });
    testNode3.addChild(
        new SimpleNode({ name: 'test3.1' })
    );
    testNode3.addChild(
        new SimpleNode({ name: 'test3.2' })
    );
    rootNode.addChild(testNode3);
    return rootNode;
};
