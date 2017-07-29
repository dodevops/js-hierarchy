import 'mocha';
import {Node} from '../index';
import {AbstractNode} from '../lib/AbstractNode';
import {NodeNotFoundError} from '../lib/error/NodeNotFoundError';
import chai = require('chai');
import {SimpleNode} from '../lib/SimpleNode';
import {DataNotFoundError} from '../lib/error/DataNotFoundError';
import {makeTestHierarchy} from './TestRessources';

let should = chai.should();

describe(
    'SimpleNode', function () {
        it('should instantiate just fine', function (done) {
            let component = new SimpleNode();
            should.exist(component, 'Node did not instantiate!');
            done();
        });
        it('can be constructed into a tree', function (done) {

            let rootNode = makeTestHierarchy();

            should.equal(
                rootNode.isRoot(),
                true,
                'Root node is not root node'
            );

            should.equal(
                rootNode.getChildren()[1].isRoot(),
                false,
                'Child not is a root node'
            );

            rootNode.getChildren()[0].getParent()
                .should.equal(
                rootNode,
                'Invalid parent'
            );

            rootNode.getChildren().length
                .should.equal(
                3,
                'Invalid number of root children'
            );

            rootNode.getChildren()[0].getData('name')
                .should.equal(
                'test1',
                'Invalid node'
            );

            rootNode.getChildren()[1].getData('name')
                .should.equal(
                'test2',
                'Invalid node'
            );

            rootNode.getChildren()[2].getData('name')
                .should.equal(
                'test3',
                'Invalid node'
            );

            let testNode3 = rootNode.getChildren()[2];

            testNode3.getChildren().length
                .should.equal(
                2,
                'Invalid number of test node 3 children'
            );

            testNode3.getChildren()[0].getData('name').should.equal(
                'test3.1',
                'Invalid node'
            );

            testNode3.getChildren()[1].getData('name').should.equal(
                'test3.2',
                'Invalid node'
            );

            done();

        });
        describe('#findChild', () => {
            it('should find a child', function (done) {
                let rootNode = makeTestHierarchy();

                rootNode.findChild(rootNode.getChildren()[1])
                    .should.equal(
                    1,
                    'Invalid node returned'
                );

                done();
            });
            it('should throw when not finding a node', function (done) {

                let rootNode = makeTestHierarchy();

                should.throw(
                    () => {
                        rootNode.findChild(<Node> new SimpleNode());
                    },
                    NodeNotFoundError,
                    'Invalid Node AbstractNode with 0 children',
                    'Did not throw'
                );

                done();

            });
        });

        describe('#removeChild', () => {
            it('should remove a child by a node', function (done) {

                let rootNode = makeTestHierarchy();

                rootNode.removeChild(rootNode.getChildren()[1]);

                rootNode.getChildren().length
                    .should.equal(
                    2,
                    'Node was not removed'
                );

                rootNode.getChildren()[0].getData('name')
                    .should.equal(
                    'test1',
                    'Invalid hierarchy'
                );

                rootNode.getChildren()[1].getData('name')
                    .should.equal(
                    'test3',
                    'Invalid hierarchy'
                );

                done();

            });

            it('should remove a child specified by id', function (done) {
                let rootNode = makeTestHierarchy();

                rootNode.removeChild(1);

                rootNode.getChildren().length
                    .should.equal(
                    2,
                    'Did not remove'
                );

                rootNode.getChildren()[0].getData('name')
                    .should.equal(
                    'test1',
                    'Invalid hierarchy'
                );

                rootNode.getChildren()[1].getData('name')
                    .should.equal(
                    'test3',
                    'Invalid hierarchy'
                );

                done();
            });

            it('should throw when not finding a child by id', function (done) {
                let rootNode = makeTestHierarchy();

                should.throw(
                    () => {
                        rootNode.removeChild(99)
                    },
                    NodeNotFoundError,
                    'Node with id 99 was not found',
                    'Did not throw'
                );
                done();

            });

            it(
                'should throw when not finding a child by a node',
                function (done) {
                    let rootNode = makeTestHierarchy();

                    should.throw(
                        () => {
                            rootNode.removeChild(new SimpleNode())
                        },
                        NodeNotFoundError,
                        'Invalid Node AbstractNode with 0 children',
                        'Did not throw'
                    );

                    done();
                }
            );

        });

        describe('#addChild', () => {
            it('should add a node between two existing nodes', function (done) {
                let rootNode = makeTestHierarchy();

                rootNode.addChild(
                    new SimpleNode({ name: 'testbetween' }),
                    1
                );

                rootNode.getChildren()[1].getData('name')
                    .should.equal(
                    'testbetween',
                    'Did not add'
                );

                rootNode.getChildren().length
                    .should.equal(
                    4,
                    'Did not add'
                );

                rootNode.getChildren()[0].getData('name')
                    .should.equal(
                    'test1',
                    'Invalid hierarchy'
                );

                rootNode.getChildren()[2].getData('name')
                    .should.equal(
                    'test2',
                    'Invalid hierarchy'
                );

                done();

            });
        });

        describe('#toString', () => {
            it('should represent the node', function (done) {
                let rootNode = makeTestHierarchy();

                rootNode.toString()
                    .should.equal(
                    'AbstractNode with 3 children: AbstractNode with 0 children, AbstractNode with 0 children, AbstractNode with 2 children: AbstractNode with 0 children, AbstractNode with 0 children',
                    'Invalid representation'
                );

                done();
            });
        });

        describe('#getData/#setData', () => {
            it('should set/get arbitrary data', function (done) {
                let rootNode = makeTestHierarchy();

                rootNode.setData('testkey', 'testvalue');

                rootNode.getData('testkey')
                    .should.equal(
                        'testvalue',
                        'Invalid value'
                );

                done();
            });
        });

        describe('#getData', () => {
            it('should throw on an invalid key', function (done) {
                let rootNode = makeTestHierarchy();

                should.throw(
                    () => {rootNode.getData('INVALIDKEY')},
                    DataNotFoundError,
                    'No data found with key INVALIDKEY',
                    'Did not throw'
                );

                done();
            });
        });
    }
);
