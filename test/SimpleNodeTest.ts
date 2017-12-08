/**
 * @module Test
 */
/**
 * Test a simple node
 */
import 'mocha';
import {Node} from '../lib/Node';
import {SimpleNode} from '../lib/SimpleNode';
import {makeTestHierarchy} from './TestRessources';
import chai = require('chai');
import Bluebird = require('bluebird');

// for Browser tests

if (typeof window !== 'undefined') {
    mocha.setup(
        {
            ui: 'bdd'
        }
    );
}

describe(
    'SimpleNode', function () {
        it('should instantiate just fine', function () {
            let component = new SimpleNode();
            chai.expect(
                component,
                'Node did not instantiate!'
            ).to.exist;
        });
        it('can be constructed into a tree', function () {

            let rootNode = makeTestHierarchy();

            chai.expect(
                rootNode.isRoot(),
                'Root node is not root node'
            ).to.be.true;

            chai.expect(
                rootNode.getChildren()[1].isRoot(),
                'Child not is a root node'
            ).to.be.false;

            chai.expect(
                rootNode.getChildren()[0].getParent(),
                'Invalid parent'
            ).to.equal(
                rootNode);

            chai.expect(
                rootNode.getChildren().length,
                'Invalid number of root children'
            ).to.equal(
                3);

            chai.expect(
                rootNode.getChildren()[0].name,
                'Invalid node'
            ).to.equal(
                'test1');

            chai.expect(
                rootNode.getChildren()[1].name,
                'Invalid node'
            ).to.equal(
                'test2');

            chai.expect(
                rootNode.getChildren()[2].name,
                'Invalid node'
            ).to.equal(
                'test3');

            let testNode3 = rootNode.getChildren()[2];

            chai.expect(
                testNode3.getChildren().length,
                'Invalid number of test node 3 children'
            ).to.equal(
                2);


            chai.expect(
                testNode3.getChildren()[0].name,
                'Invalid node'
            ).to.equal(
                'test3.1');

            chai.expect(
                testNode3.getChildren()[1].name,
                'Invalid node'
            ).to.equal(
                'test3.2');

        });
        describe('#findChild', () => {
            it('should find a child', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    rootNode.findChild(rootNode.getChildren()[1]),
                    'Invalid node returned'
                ).to.equal(
                    1);
            });
            it('should throw when not finding a node', function () {

                let rootNode = makeTestHierarchy();

                chai.expect(
                    () => {
                        rootNode.findChild(<Node> new SimpleNode());
                    },
                    'Did not throw'
                )
                    .to.throw(
                    'Invalid Node {"_class":"SimpleNode","_isRoot":true,'
                    + '"_data":{},"_children":[]}'
                );

            });
        });

        describe('#removeChild', () => {
            it('should remove a child by a node', function () {

                let rootNode = makeTestHierarchy();

                rootNode.removeChild(rootNode.getChildren()[1]);

                chai.expect(
                    rootNode.getChildren().length,
                    'Node was not removed'
                ).to.equal(
                    2);

                chai.expect(
                    rootNode.getChildren()[0].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test1');

                chai.expect(
                    rootNode.getChildren()[1].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test3');

            });

            it('should remove a child specified by id', function () {
                let rootNode = makeTestHierarchy();

                rootNode.removeChild(1);

                chai.expect(
                    rootNode.getChildren().length,
                    'Did not remove'
                ).to.equal(
                    2);

                chai.expect(
                    rootNode.getChildren()[0].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test1');

                chai.expect(
                    rootNode.getChildren()[1].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test3');
            });

            it('should throw when not finding a child by id', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    () => {
                        rootNode.removeChild(99);
                    },
                    'Did not throw'
                )
                    .to.throw(
                    'Node with id 99 was not found'
                );

            });

            it(
                'should throw when not finding a child by a node',
                function () {
                    let rootNode = makeTestHierarchy();

                    chai.expect(
                        () => {
                            rootNode.removeChild(new SimpleNode());
                        },
                        'Did not throw'
                    )
                        .to.throw(
                        'Invalid Node {"_class":"SimpleNode",'
                        + '"_isRoot":true,"_data":{},"_children":[]}'
                    );
                }
            );

        });

        describe('#addChild', () => {
            it('should add a node between two existing nodes', function () {
                let rootNode = makeTestHierarchy();

                rootNode.addChild(
                    new SimpleNode('testbetween'),
                    1
                );

                chai.expect(
                    rootNode.getChildren()[1].name,
                    'Did not add'
                ).to.equal(
                    'testbetween');

                chai.expect(
                    rootNode.getChildren().length,
                    'Did not add'
                ).to.equal(
                    4);

                chai.expect(
                    rootNode.getChildren()[0].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test1');

                chai.expect(
                    rootNode.getChildren()[2].name,
                    'Invalid hierarchy'
                ).to.equal(
                    'test2');

            });
        });

        describe('#toJSON', () => {
            it('should represent the node', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    JSON.parse(rootNode.toJSON())._class,
                    'Invalid JSON represenation'
                ).to.equal(
                    'SimpleNode');
            });
        });

        describe('#getData/#setData', () => {
            it('should set/get arbitrary data', function () {
                let rootNode = makeTestHierarchy();

                rootNode.setData('testkey', 'testvalue');

                chai.expect(
                    rootNode.getData('testkey'),
                    'Invalid value'
                ).to.equal(
                    'testvalue');
            });
        });

        describe('#getData', () => {
            it('should throw on an invalid key', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    () => {
                        rootNode.getData('INVALIDKEY');
                    },
                    'Did not throw'
                )
                    .to.throw(
                    'No data found with key INVALIDKEY'
                );
            });
        });

        describe('#getRoot', () => {
            it('should provide the root of a node', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    rootNode.getChildren()[2].getChildren()[0].getRoot().name
                ).to.equal('root');

                chai.expect(
                    rootNode.getChildren()[2].getRoot().name
                ).to.equal('root');

                chai.expect(
                    rootNode.getChildren()[0].getRoot().name
                ).to.equal('root');
            });
        });

        describe('#getPath', () => {
            it('should provide the path to a node', function () {
                let rootNode = makeTestHierarchy();

                return Bluebird.all(
                    [
                        rootNode.getChildren()[2].getChildren()[0].getPath(),
                        rootNode.getChildren()[2].getPath(),
                        rootNode.getChildren()[0].getPath(),
                        rootNode.getPath()
                    ]
                )

                    .then(
                        paths => {
                            chai.expect(
                                paths[0]
                            ).to.equal('root/test3/test3.1');
                            chai.expect(
                                paths[1]
                            ).to.equal('root/test3');
                            chai.expect(
                                paths[2]
                            ).to.equal('root/test1');
                            chai.expect(
                                paths[3]
                            ).to.equal('root');
                        }
                    );

            });
            it('should work with custom path separators', function () {
                let rootNode = makeTestHierarchy();

                return rootNode.getChildren()[2].getChildren()[0].getPath('|')
                    .then(
                        path => {
                            chai.expect(path).to.equal('root|test3|test3.1');
                        }
                    );
            });
        });

        describe('#getNodeByPath', () => {
            it('should provide the node to a path', function () {
                let rootNode = makeTestHierarchy();

                return Bluebird.all(
                    [
                        rootNode.getNodeByPath('root/test3/test3.1'),
                        rootNode.getNodeByPath('root/test3'),
                        rootNode.getNodeByPath('root/test1'),
                        rootNode.getNodeByPath('root'),
                    ]
                )

                    .then(
                        nodes => {
                            chai.expect(
                                nodes[0].name
                            ).to.equal('test3.1');
                            chai.expect(
                                nodes[0].getParent().name
                            ).to.equal('test3');
                            chai.expect(
                                nodes[1].name
                            ).to.equal('test3');
                            chai.expect(
                                nodes[1].getParent().name
                            ).to.equal('root');
                            chai.expect(
                                nodes[2].name
                            ).to.equal('test1');
                            chai.expect(
                                nodes[2].getParent().name
                            ).to.equal('root');
                            chai.expect(
                                nodes[3].name
                            ).to.equal('root');
                        }
                    );

            });
            it('should work from another node than root', function () {
                let rootNode = makeTestHierarchy();

                return rootNode.getChildren()[2].getChildren()[0].getNodeByPath('root/test1')
                    .then(
                        node => {
                            chai.expect(node.name).to.equal('test1');
                        }
                    );
            });
            it('should work with custom path separators', function () {
                let rootNode = makeTestHierarchy();

                return rootNode.getNodeByPath('root|test1', '|')
                    .then(
                        node => {
                            chai.expect(node.name).to.equal('test1');
                        }
                    );
            });
        });

        describe('#getChildByName', () => {
            it('should fetch a child by its name', function () {
                let rootNode = makeTestHierarchy();

                chai.expect(
                    rootNode.getChildByName('test2')
                ).to.be.not.null;

                chai.expect(
                    rootNode.getChildByName('invalidNode')
                ).to.be.null;
            });
        });

    }
);
