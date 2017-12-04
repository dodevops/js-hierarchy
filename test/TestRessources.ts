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
    let rootNode = new SimpleNode('root');
    rootNode.addChild(
        new SimpleNode('test1')
    );
    rootNode.addChild(
        new SimpleNode('test2')
    );
    let testNode3 = new SimpleNode('test3');
    testNode3.addChild(
        new SimpleNode('test3.1')
    );
    testNode3.addChild(
        new SimpleNode('test3.2')
    );
    rootNode.addChild(testNode3);
    return rootNode;
};
