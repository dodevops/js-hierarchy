/**
 * @module Test
 */
/**
 * Test walkers
 */
import 'mocha';
import {Node} from '../lib/Node';
import {makeTestHierarchy} from './TestRessources';
import {Direction} from '../lib/Direction';
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
import Bluebird = require('bluebird');

chai.use(chaiAsPromised);

// for Browser tests

if (typeof window !== 'undefined') {
    mocha.setup(
        {
            ui: 'bdd'
        }
    );
}

describe('Node#walk', () => {
    let checkNodes: any[] = [
        {
            node: makeTestHierarchy().getChildren()[2].getChildren()[0],
            description: 'DownWalker',
            direction: Direction.down,
            expectedNodes: [
                'test3.1',
                'test3',
                'root'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2].getChildren()[0],
            description: 'RootUpWalker',
            direction: Direction.rootUp,
            expectedNodes: [
                'root',
                'test3',
                'test3.1'
            ]
        },
        {
            node: makeTestHierarchy(),
            description: 'UpWalker',
            direction: Direction.up,
            expectedNodes: [
                'test1',
                'test2',
                'test3',
                'test3.1',
                'test3.2'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[1],
            description: 'LeftWalker',
            direction: Direction.left,
            expectedNodes: [
                'test1'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[1],
            description: 'RightWalker',
            direction: Direction.right,
            expectedNodes: [
                'test3'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2],
            description: 'LeftWalker and UpWalker',
            direction: [Direction.left, Direction.up],
            expectedNodes: [

                'test2',
                'test1',
                'test3.1',
                'test3.2'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[1],
            description: 'LeftWalker and DownWalker',
            direction: [Direction.left, Direction.down],
            expectedNodes: [
                'test1',
                'test2',
                'root'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2],
            description: 'RightWalker and UpWalker',
            direction: [Direction.right, Direction.up],
            expectedNodes: [
                'test3.1',
                'test3.2'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[1],
            description: 'RightWalker and DownWalker',
            direction: [Direction.right, Direction.down],
            expectedNodes: [
                'test3',
                'test2',
                'root'
            ]
        }
    ];

    for (let checkNode of checkNodes) {
        describe(`using ${checkNode.description}`, () => {
            it('should find all expected nodes', function () {
                let nodeId = 0;

                return checkNode.node.walk(
                    checkNode.direction,
                    (node: Node): Bluebird<void> => {
                        chai.expect(
                            node.getData('name'),
                            'Invalid node found'
                        )
                            .to.equal(
                            checkNode.expectedNodes[nodeId]
                        );
                        nodeId++;
                        return Bluebird.resolve();
                    }
                ).then(
                    () => {

                        chai.expect(
                            nodeId,
                            'Not all nodes found'
                        )
                            .to.equal(
                            checkNode.expectedNodes.length
                        );
                    }
                );
            });
        });
    }

    it('should throw when using an invalid direction', function () {
        let rootNode = makeTestHierarchy();

        return chai.expect(
            rootNode.walk(9, (node: Node): Bluebird<void> => {
                return Bluebird.resolve();
            }),
            'Did not throw'
        )
            .to.be.rejectedWith(
                'Invalid direction 9',
            );
    });
});
