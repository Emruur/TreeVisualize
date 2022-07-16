import Tree from "./Tree";
import Vector from "./utils/vector";

class TreeNode<TreeType> {
    item: TreeType;
    left: TreeNode<TreeType>;
    right: TreeNode<TreeType>;
    height: number;

    constructor(item: TreeType) {
        this.item = item;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}



export default class BinarySearchTree<TreeType> implements Tree<TreeType> {
    private head: TreeNode<TreeType>;
    size: number;
    height: number;

    constructor() {
        this.head = null;
        this.size = 0;
        this.height = 0;
    }

    updateHeight() {
        this.height = this.updateTreeHeight(this.head);
    }

    private updateTreeHeight(node: TreeNode<TreeType>): number {
        if (!node) return 0;

        let height: number =
            Math.max(this.updateTreeHeight(node.left), this.updateTreeHeight(node.right)) + 1;
        node.height = height;
        return height;
    }

    add(data: TreeType) {
        this.head = this.addNode(this.head, data);
    }

    private addNode(node: TreeNode<TreeType>, key: TreeType): TreeNode<TreeType> {
        if (!node) {
            node = new TreeNode(key);
        } else if (key < node.item) {
            node.left = this.addNode(node.left, key);
        } else {
            node.right = this.addNode(node.right, key);
        }

        //fix unbalances
        //calculate balance factor for current node
        //TODO very expensive updating height this vay
        this.updateHeight();

        if (this.getBalanceFactor(node) > 1) {
            //right rotation
            if (key > node.left.item) {
                //double rotation
                node = this.leftRightRotate(node);
                this.updateHeight();
            } else {
                //single rotation
                node = this.rightRotate(node);
                this.updateHeight();
            }
        } else if (this.getBalanceFactor(node) < -1) {
            //left rotation , right heavy
            if (key < node.right.item) {
                //double rotation
                node = this.rightLeftRotate(node);
                this.updateHeight();
            } else {
                //single rotation
                node = this.leftRotate(node);
                this.updateHeight();
            }
        }
        return node;
    }

    remove(data: TreeType) {
        this.head = this.removeNode(this.head, data);
        this.updateHeight();
    }

    // Method to remove node with a
    // given data
    // it recur over the tree to find the
    // data and removes it
    private removeNode(node: TreeNode<TreeType>, key: TreeType): TreeNode<TreeType> {
        // if the root is null then tree is
        // empty
        if (node === null) return null;
        // if data to be delete is less than
        // roots data then move to left subtree
        else if (key < node.item) {
            node.left = this.removeNode(node.left, key);
            return node;
        }

        // if data to be delete is greater than
        // roots data then move to right subtree
        else if (key > node.item) {
            node.right = this.removeNode(node.right, key);
            return node;
        } else {
            // deleting node with no children
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            // deleting node with one children
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }

            // Deleting node with two children
            // minimum node of the right subtree
            // is stored in aux
            var aux: TreeNode<TreeType> = this.findMinNode(node.right);
            node.item = aux.item;

            node.right = this.removeNode(node.right, aux.item);
            return node;
        }
    }

    // finds the minimum node in tree
    // searching starts from given node
    private findMinNode(node: TreeNode<TreeType>): TreeNode<TreeType> {
        // if left of a node is null
        // then it must be minimum node
        if (node.left === null) return node;
        else return this.findMinNode(node.left);
    }

    //right rotate
    rightRotate(y: TreeNode<TreeType>) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        return x;
    }

    //left rotate
    leftRotate(x: TreeNode<TreeType>) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        return y;
    }

    leftRightRotate(node: TreeNode<TreeType>) {
        node.left = this.leftRotate(node.left);
        node = this.rightRotate(node);
        return node;
    }
    rightLeftRotate(node: TreeNode<TreeType>) {
        node.right = this.rightRotate(node.right);
        node = this.leftRotate(node);
        return node;
    }

    getBalanceFactor(node: TreeNode<TreeType>): number {
        if (node == null) {
            return 0;
        }

        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    getHeight(node: TreeNode<TreeType>): number {
        if (!node) return 0;
        return node.height;
    }

    drawTree(ctx: CanvasRenderingContext2D, width: number) {
        let radius = width / 27;
        let initialPos = new Vector(width / 2,  Math.max(3.5 * radius, 100));
        this.drawTreeHelper(this.head, initialPos, radius, 0, ctx);
    }

    private drawTreeHelper(
        node: TreeNode<TreeType>,
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
        ctx.fillText(node.item.toString(), pos.x, pos.y);
        ctx.fill();

        //draw child trees
        this.drawTreeHelper(node.left, leftPos, radius, height + 1, ctx);
        this.drawTreeHelper(node.right, rightPos, radius, height + 1, ctx);
    }
}
