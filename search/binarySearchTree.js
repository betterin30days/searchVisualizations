'use strict';

const node = (key, value, left = null, right = null) => {
    // creates the basic data structure used
    // key is the number to order by
    // if this was a sorted array:
    // key would be item in array
    // value would be the index
    // value is what is stored
    // l & r = left and right nodes
    return {k: key, v: value, l: left, r: right};
};

const insert = (key, value, tree) => {
    // inserts a node into a binary search tree
    // returns the new tree
    // uses recursion with each lower node being passed as tree
    if (key === tree.k) {
        // node key already exists
        // replace value
        return node(key, value, tree.l, tree.r);
    } else if (key < tree.k) {
        // move down the tree to the left
        if (tree.l) {
            // left node exists
            // recursively call insert w/ left node
            return node(tree.k, tree.v, insert(key, value, tree.l), tree.r);
        } else {
            // insert into left node
            return node(tree.k, tree.v, node(key, value), tree.r);
        }
    } else {
        // move down the tree to the right
        if (tree.r) {
            // right node exists
            // recursively call insert w/ right node
            return node(tree.k, tree.v, tree.l, insert(key, value, tree.r));
        } else {
            // insert into right node
            return node(tree.k, tree.v, tree.l, node(key, value));
        }
    }
};

const findMin = (tree) => {
    // returns the node with the lowest key
    // this will be the left most node, not the deepest
    if (tree.l) {
        return findMin(tree.l);
    } else {
        return tree;
    }
};

const findMax = (tree) => {
    // returns the node with the highest key
    // this will be the right most node, not the deepest
    if (tree.r) {
        return findMax(tree.r);
    } else {
        return tree;
    }
};

const remove = (key, tree, successor) => {
    // remove the key from the provided binary search tree
    // successor is a boolean
    // true = in-order successor
    // false = in-order predecessor
    // this determines how removing nodes with two children are handled
    // the removed node will be replaced with the successor or predecessor
    // successor = right subtree's left most child
    // predecessor = left subtree's right most child
    // returns the new tree without that node
    // uses remove recursively to construct a new tree
    // returns a node each time while calling remove on the next subtree
    if (tree.k === key) {
        // delete this node
        if (tree.l && tree.r) {
            // node has 2 children
            if (successor) {
                // find the replacement successor node
                // replace this nodes key and value
                // remove replacement from the subtree
                const replacement = findMin(tree.r);
                return node(
                    replacement.k,
                    replacement.v,
                    tree.l,
                    remove(replacement.k, tree.r, successor)
                );
            } else {
                // find the replacement predecessor node
                // replace this nodes key and value
                // remove replacement from the subtree
                const replacement = findMax(tree.l);
                return node(
                    replacement.k,
                    replacement.v,
                    remove(replacement.k, tree.l, successor),
                    tree.r
                );
            }
        } else if (tree.l) {
            // node has only a left child
            // replace with left child node
            return tree.l;
        } else if (tree.r) {
            // node has only a right child
            // replace with right child node
            return tree.r;
        } else {
            // node has no children
            // replace node with null
            return null;
        }
    } else if (key < tree.k) {
        // move down the tree to the left
        if (tree.l) {
            // recursively call remove onto the left subtree looking for key
            return node(
                tree.v,
                tree.k,
                remove(key, tree.l, successor),
                tree.r
            );
        } else {
            // key doesnt exist in tree
            return tree;
        }
    } else {
        // move down the tree to the right
        if (tree.r) {
            // recursively call remove onto the right subtree looking for key
            return node(
                tree.v,
                tree.k,
                tree.l,
                remove(key, tree.r, successor)
            );
        } else {
            // key doesnt exist in tree
            return tree;
        }
    }
};

const search = (key, tree) => {
    // finds the key in the provided binary search tree
    // returns the value stored
    // returns null if the key was not found
    // uses recursion with each lower node being passed as tree
    if (key === tree.k) {
        // key found, return value
        return tree.v;
    } else if (key < tree.k) {
        // move down the tree to the left
        if (tree.l) {
            // left node exists
            // recursively call search w/ left node
            return search(key, tree.l);
        } else {
            // there is no left node
            // key does not exist in tree
            return null;
        }
    } else {
        // move down the tree to the right
        if (tree.r) {
            // right node exists
            // recursively call search w/ right node
            return search(key, tree.r);
        } else {
            // there is no right node
            // key does not exist in tree
            return null;
        }
    }
};

const traverse = (tree, accum = []) => {
    // traverse a bst in order
    // accum is the array accumulater
    // this is passed recursively and not mutated
    // starts with furthest left node, working to the right
    // returns an ordered array of
    // [{k: k, v: v}, {k: k, v: v}, ...]
    if (tree === null) {
        return accum;
    }
    const accumLeft = traverse(tree.l, accum);
    const accumNode = accumLeft.concat({k: tree.k, v: tree.v});
    const accumRight = traverse(tree.r, accumNode);
    return accumRight;
};

const createFromOrderedArray = (arr) => {
    // creates a balanced binary search tree
    // form an array of key value pairs
    // arr = [{k: k, v: v}, {k: k, v: v}, ...]
    // find middle element
    if (!arr.length) {
        return null;
    }
    const mid = Math.round((0 + arr.length -1) / 2);
    return node(
        arr[mid].k,
        arr[mid].v,
        // use left portion of array for left sub tree
        createFromOrderedArray(arr.slice(0, mid)),
        // use right portion of array for right sub tree
        createFromOrderedArray(arr.slice(mid + 1, arr.length))
    );
};

const createFromArray = (arr) => {
    // receives an array of keys
    // creates a binary search tree
    // the values are the index of each item in the array
    // returns the unbalanced bst
    if (!arr.length) {
        return null;
    }
    // reduce array to a bst or simply a node
    return arr.reduce(
        // pass a function that uses insert()
        (tree, key, index) => { return insert(key, index, tree); },
        // and a starting value for the tree
        node(arr[0], 0)
    );
};

const height = (tree) => {
    // returns the height of the bst
    // root is height 0
    if (tree === null) {
        // base case since root = 0 and null = -1
        return -1;
    }
    // find heights of both subtrees
    const left = height(tree.l);
    const right = height(tree.r);
    // return deepest +1 for this layer
    if (left > right) {
        return left + 1;
    } else {
        return right + 1;
    }
};

const balance = (tree) => {
    // wrapper around traverse() and createFromOrderedArray()
    // takes a bst and returns a new, balanced bst
    const arr = traverse(tree);
    return createFromOrderedArray(arr);
};

const nodesForHeight = (height, total = 0) =>{
    // calculate number of nodes in a perfect bst of given height
    // at height n, there are 2^n nodes on that level
    // root is height 0
    // recursively calc each row and add to total
    if (height < 0) {
        return total;
    }
    const nodes = Math.pow(2, height);
    return nodesForHeight(height - 1, total + nodes);
};

export {
    node,
    insert,
    findMin,
    findMax,
    remove,
    search,
    traverse,
    createFromOrderedArray,
    createFromArray,
    height,
    balance,
    nodesForHeight
};
