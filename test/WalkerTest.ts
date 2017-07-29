import 'mocha';
import {Node} from '../index';
import {makeTestHierarchy} from './TestRessources';
import {Direction} from '../lib/Direction';
import {InvalidDirectionError} from '../lib/error/InvalidDirectionError';
import chai = require('chai');

let should = chai.should();

describe('Node#walk', () => {
    let checkNodes: any[] = [
        {
            node: makeTestHierarchy(),
            description: 'DownWalker',
            direction: Direction.down,
            expectedNodes: [
                'test1',
                'test2',
                'test3',
                'test3.1',
                'test3.2'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2].getChildren()[0],
            description: 'UpWalker',
            direction: Direction.up,
            expectedNodes: [
                'test3',
                'root'
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
            node: makeTestHierarchy().getChildren()[1],
            description: 'LeftWalker and UpWalker',
            direction: [Direction.left, Direction.up],
            expectedNodes: [
                'test1',
                'root'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2],
            description: 'LeftWalker and DownWalker',
            direction: [Direction.left, Direction.down],
            expectedNodes: [
                'test2',
                'test1',
                'test3.1',
                'test3.2'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[1],
            description: 'RightWalker and UpWalker',
            direction: [Direction.right, Direction.up],
            expectedNodes: [
                'test3',
                'root'
            ]
        },
        {
            node: makeTestHierarchy().getChildren()[2],
            description: 'RightWalker and DownWalker',
            direction: [Direction.right, Direction.down],
            expectedNodes: [
                'test3.1',
                'test3.2'
            ]
        }
    ];

    for (let checkNode of checkNodes) {
        describe(`using ${checkNode.description}`, () => {
            it('should find all expected nodes', function (done) {
                let nodeId = 0;

                checkNode.node.walk(
                    checkNode.direction,
                    (node: Node) => {
                        node.getData('name')
                            .should.equal(
                            checkNode.expectedNodes[nodeId],
                            'Invalid node found'
                        );
                        nodeId++;
                    }
                );

                nodeId
                    .should.equal(
                    checkNode.expectedNodes.length,
                    'Not all nodes found'
                );

                done();
            });
        });
    }

    it('should throw when using an invalid direction', function (done) {
        let rootNode = makeTestHierarchy();

        should.throw(
            () => {
                rootNode.walk(9, (node: Node) => {
                    // nothing
                });
            },
            InvalidDirectionError,
            'Invalid direction 9',
            'Did not throw'
        );

        done();
    });
});
