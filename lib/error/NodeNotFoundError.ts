/**
 * @module js-hierarchy
 */
/**
 * The specified node can not be found
 */
export class NodeNotFoundError extends Error implements Error {

    public name: string = 'NodeNotFoundError';

    constructor(nameOrId: string | number) {
        super('');
        if (typeof nameOrId === 'number') {
            this.message = `Node with id ${nameOrId} not found`;
        } else {
            this.message = `Node with name ${nameOrId} not found`;
        }
    }

}
