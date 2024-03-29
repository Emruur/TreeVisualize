import Tree from "./Tree";
import Vector from "./utils/vector"

export class Node<K, V> {
    public left: Node<K, V> | null = null;
    public right: Node<K, V> | null = null;
    public height: number | null = null;

    constructor(public key: K, public value: V | undefined) {
        
    }

    /**
     * Performs a right rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.left is null.
     */
    public rotateRight(): Node<K, V> {
        const other = <Node<K, V>>this.left;
        this.left = other.right;
        other.right = this;
        this.height = Math.max(this.leftHeight, this.rightHeight) + 1;
        other.height = Math.max(other.leftHeight, this.height) + 1;
        return other;
    }

    /**
     * Performs a left rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.right is null.
     */
    public rotateLeft(): Node<K, V> {

        const other = <Node<K, V>>this.right;
        this.right = other.left;
        other.left = this;
        this.height = Math.max(this.leftHeight, this.rightHeight) + 1;
        other.height = Math.max(other.rightHeight, this.height) + 1;
        return other;
    }

    /**
     * Convenience function to get the height of the left child of the node,
     * returning -1 if the node is null.
     * @return The height of the left child, or -1 if it doesn't exist.
     */
    public get leftHeight(): number {
        if (this.left === null) {
            return -1;
        }
        return this.left.height || 0;
    }

    /**
     * Convenience function to get the height of the right child of the node,
     * returning -1 if the node is null.
     * @return The height of the right child, or -1 if it doesn't exist.
     */
    public get rightHeight(): number {
        if (this.right === null) {
            return -1;
        }
        return this.right.height || 0;
    }
}
/**
 * Represents how balanced a node's left and right children are.
 */
const enum BalanceState {
    /** Right child's height is 2+ greater than left child's height */
    UNBALANCED_RIGHT,
    /** Right child's height is 1 greater than left child's height */
    SLIGHTLY_UNBALANCED_RIGHT,
    /** Left and right children have the same height */
    BALANCED,
    /** Left child's height is 1 greater than right child's height */
    SLIGHTLY_UNBALANCED_LEFT,
    /** Left child's height is 2+ greater than right child's height */
    UNBALANCED_LEFT,
}

export default class AvlTree<K, V> implements Tree<K> {
    protected _root: Node<K, V> | null = null;
    private _size: number = 0;
    private _compare;

    clear(){
        this._size= 0
        this._root= null
    }

    add(key: K) {
        this.insert(key, key as any);
    }

    remove(key: K) {
        this.delete(key)
    }

    drawTree(ctx: CanvasRenderingContext2D, width: number) {
        let radius = width / 27;
        let initialPos = new Vector(width / 2,  Math.max(3.5 * radius, 100));
        this.drawTreeHelper(this._root, initialPos, radius, 0, ctx);
    }

    private drawTreeHelper(
        node: Node<K,V>,
        pos: Vector,
        radius: number,
        height: number,
        ctx: CanvasRenderingContext2D
    ) {
        if (!node) return;

        let leftPos = pos.copy()
        leftPos.add((-radius * 39) / (height + 2) ** 2.25, radius * 2.7)

        let rightPos = pos.copy()
        rightPos.add((radius * 39) / (height + 2) ** 2.25, radius * 2.7)

        //draw lines connecting nodes
        if (node.left) {
            ctx.beginPath(); // Start a new path
            ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
            ctx.lineTo(leftPos.x, leftPos.y); // Draw a line to (150, 100)
            ctx.lineWidth= 5
            ctx.strokeStyle = "#9dcded";
            ctx.stroke();
        }
        if (node.right){
            ctx.beginPath(); // Start a new path
            ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
            ctx.lineTo(rightPos.x, rightPos.y); // Draw a line to (150, 100)
            ctx.lineWidth= 5
            ctx.strokeStyle = "#9dcded";
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = "#172026";
        
        ctx.font = (radius/2.5).toString()+"px Courier New";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#9dcded";
        ctx.arc(pos.x, pos.y, radius/2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke()
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.textAlign= "center";
        ctx.textBaseline = 'middle'; 
        ctx.fillText(node.value.toString(), pos.x, pos.y);
        ctx.fill();

        //draw child trees
        this.drawTreeHelper(node.left, leftPos, radius, height + 1, ctx);
        this.drawTreeHelper(node.right, rightPos, radius, height + 1, ctx);
    }
        
    /**
     * Creates a new AVL Tree.
     * @param _compare An optional custom compare function.
     */
    constructor(compare?) {
        this._compare = compare ? compare : this._defaultCompare;
    }

    /**
     * Compares two keys with each other.
     * @param a The first key to compare.
     * @param b The second key to compare.
     * @return -1, 0 or 1 if a < b, a == b or a > b respectively.
     */
    private _defaultCompare(a: K, b: K): number {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }

    /**
     * Inserts a new node with a specific key into the tree.
     * @param key The key being inserted.
     * @param value The value being inserted.
     */
    public insert(key: K, value?: V): void {
        this._root = this._insert(key, value, this._root);
        this._size++;
    }

    /**
     * Inserts a new node with a specific key into the tree.
     * @param key The key being inserted.
     * @param root The root of the tree to insert in.
     * @return The new tree root.
     */
    private _insert(key: K, value: V | undefined, root: Node<K, V> | null): Node<K, V> {
        // Perform regular BST insertion
        if (root === null) {
            return new Node(key, value);
        }

        if (this._compare(key, root.key) < 0) {
            root.left = this._insert(key, value, root.left);
        } else if (this._compare(key, root.key) > 0) {
            root.right = this._insert(key, value, root.right);
        } else {
            // It's a duplicate so insertion failed, decrement size to make up for it
            this._size--;
            return root;
        }

        // Update height and rebalance tree
        root.height = Math.max(root.leftHeight, root.rightHeight) + 1;
        const balanceState = this._getBalanceState(root);

        if (balanceState === BalanceState.UNBALANCED_LEFT) {
            if (this._compare(key, (<Node<K, V>>root.left).key) < 0) {
                // Left left case
                root = root.rotateRight();
            } else {
                // Left right case
                root.left = (<Node<K, V>>root.left).rotateLeft();
                return root.rotateRight();
            }
        }

        if (balanceState === BalanceState.UNBALANCED_RIGHT) {
            if (this._compare(key, (<Node<K, V>>root.right).key) > 0) {
                // Right right case
                root = root.rotateLeft();
            } else {
                // Right left case
                root.right = (<Node<K, V>>root.right).rotateRight();
                return root.rotateLeft();
            }
        }

        return root;
    }

    /**
     * Deletes a node with a specific key from the tree.
     * @param key The key being deleted.
     */
    public delete(key: K): void {
        this._root = this._delete(key, this._root);
        this._size--;
    }

    /**
     * Deletes a node with a specific key from the tree.
     * @param key The key being deleted.
     * @param root The root of the tree to delete from.
     * @return The new tree root.
     */
    private _delete(key: K, root: Node<K, V> | null): Node<K, V> | null {
        // Perform regular BST deletion
        if (root === null) {
            this._size++;
            return root;
        }

        if (this._compare(key, root.key) < 0) {
            // The key to be deleted is in the left sub-tree
            root.left = this._delete(key, root.left);
        } else if (this._compare(key, root.key) > 0) {
            // The key to be deleted is in the right sub-tree
            root.right = this._delete(key, root.right);
        } else {
            // root is the node to be deleted
            if (!root.left && !root.right) {
                root = null;
            } else if (!root.left && root.right) {
                root = root.right;
            } else if (root.left && !root.right) {
                root = root.left;
            } else {
                // Node has 2 children, get the in-order successor
                const inOrderSuccessor = this._minValueNode(<Node<K, V>>root.right);
                root.key = inOrderSuccessor.key;
                root.value = inOrderSuccessor.value;
                root.right = this._delete(inOrderSuccessor.key, root.right);
            }
        }

        if (root === null) {
            return root;
        }

        // Update height and rebalance tree
        root.height = Math.max(root.leftHeight, root.rightHeight) + 1;
        const balanceState = this._getBalanceState(root);

        if (balanceState === BalanceState.UNBALANCED_LEFT) {
            // Left left case
            if (
                this._getBalanceState(<Node<K, V>>root.left) === BalanceState.BALANCED ||
                this._getBalanceState(<Node<K, V>>root.left) ===
                    BalanceState.SLIGHTLY_UNBALANCED_LEFT
            ) {
                return root.rotateRight();
            }
            // Left right case
            // this._getBalanceState(root.left) === BalanceState.SLIGHTLY_UNBALANCED_RIGHT
            root.left = (<Node<K, V>>root.left).rotateLeft();
            return root.rotateRight();
        }

        if (balanceState === BalanceState.UNBALANCED_RIGHT) {
            // Right right case
            if (
                this._getBalanceState(<Node<K, V>>root.right) === BalanceState.BALANCED ||
                this._getBalanceState(<Node<K, V>>root.right) ===
                    BalanceState.SLIGHTLY_UNBALANCED_RIGHT
            ) {
                return root.rotateLeft();
            }
            // Right left case
            // this._getBalanceState(root.right) === BalanceState.SLIGHTLY_UNBALANCED_LEFT
            root.right = (<Node<K, V>>root.right).rotateRight();
            return root.rotateLeft();
        }

        return root;
    }

    /**
     * Gets the value of a node within the tree with a specific key.
     * @param key The key being searched for.
     * @return The value of the node (which may be undefined), or null if it
     * doesn't exist.
     */
    public get(key: K): V | undefined | null {
        if (this._root === null) {
            return null;
        }

        const result = this._get(key, this._root);
        if (result === null) {
            return null;
        }

        return result.value;
    }

    /**
     * Gets the value of a node within the tree with a specific key.
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return The value of the node or null if it doesn't exist.
     */
    private _get(key: K, root: Node<K, V>): Node<K, V> | null {
        const result = this._compare(key, root.key);
        if (result === 0) {
            return root;
        }

        if (result < 0) {
            if (!root.left) {
                return null;
            }
            return this._get(key, root.left);
        }

        if (!root.right) {
            return null;
        }
        return this._get(key, root.right);
    }

    /**
     * Gets whether a node with a specific key is within the tree.
     * @param key The key being searched for.
     * @return Whether a node with the key exists.
     */
    public contains(key: K): boolean {
        if (this._root === null) {
            return false;
        }

        return !!this._get(key, this._root);
    }

    /**
     * @return The minimum key in the tree or null if there are no nodes.
     */
    public findMinimum(): K | null {
        if (this._root === null) {
            return null;
        }
        return this._minValueNode(this._root).key;
    }

    /**
     * Gets the maximum key in the tree or null if there are no nodes.
     */
    public findMaximum(): K | null {
        if (this._root === null) {
            return null;
        }
        return this._maxValueNode(this._root).key;
    }

    /**
     * Gets the size of the tree.
     */
    public get size(): number {
        return this._size;
    }

    /**
     * Gets whether the tree is empty.
     */
    public get isEmpty(): boolean {
        return this._size === 0;
    }

    /**
     * Gets the minimum value node, rooted in a particular node.
     * @param root The node to search.
     * @return The node with the minimum key in the tree.
     */
    private _minValueNode(root: Node<K, V>): Node<K, V> {
        let current = root;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    /**
     * Gets the maximum value node, rooted in a particular node.
     * @param root The node to search.
     * @return The node with the maximum key in the tree.
     */
    private _maxValueNode(root: Node<K, V>): Node<K, V> {
        let current = root;
        while (current.right) {
            current = current.right;
        }
        return current;
    }

    /**
     * Gets the balance state of a node, indicating whether the left or right
     * sub-trees are unbalanced.
     * @param node The node to get the difference from.
     * @return The BalanceState of the node.
     */
    private _getBalanceState(node: Node<K, V>): BalanceState {
        const heightDifference = node.leftHeight - node.rightHeight;
        switch (heightDifference) {
            case -2:
                return BalanceState.UNBALANCED_RIGHT;
            case -1:
                return BalanceState.SLIGHTLY_UNBALANCED_RIGHT;
            case 1:
                return BalanceState.SLIGHTLY_UNBALANCED_LEFT;
            case 2:
                return BalanceState.UNBALANCED_LEFT;
            default:
                return BalanceState.BALANCED;
        }
    }
}
