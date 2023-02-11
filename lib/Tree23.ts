import Tree from "./Tree";
import Vector from "./utils/vector"

type K = number | string;

enum ChildType {
    left,
    middle,
    right,
}

class TreeNode<K> {
    smallItem: K;
    largeItem: K | null = null;

    leftChild: TreeNode<K> | null = null;
    middleChild: TreeNode<K> | null = null;
    rightChild: TreeNode<K> | null = null;

    parent: TreeNode<K> | null = null;
    childType: ChildType | null = null;

    height: number= 1

    constructor(item: K) {
        this.smallItem = item;
    }

    isTwoNode(): boolean {
        return this.largeItem === null;
    }

    isLeafNode(): boolean {
        return this.leftChild ? false : true;
    }

    addItem(item: K): TreeNode<K> | null {
        if (!this.isLeafNode()) throw new Error("Can't add item to non leaf node!");

        if (this.isTwoNode()) {
            if(item< this.smallItem){
                this.largeItem= this.smallItem
                this.smallItem= item
            }
            else{
                this.largeItem= item
            }
            return null;
        }
        let nodes = [item, this.smallItem, this.largeItem].sort(
            (a: K, b: K) => Number(a) - Number(b)
        );
        //reguires split
        let newNode: TreeNode<K> = new TreeNode<K>(nodes[1]);
        let newLeftNode: TreeNode<K> = new TreeNode<K>(nodes[0]);
        let newRightNode: TreeNode<K> = new TreeNode<K>(nodes[2]);

        newLeftNode.parent = newNode;
        newLeftNode.childType = ChildType.left

        newRightNode.parent = newNode
        newRightNode.childType = ChildType.middle;

        newNode.leftChild = newLeftNode;
        newNode.middleChild = newRightNode;
        newNode.parent = this.parent;
        newNode.childType = this.childType;


        return newNode;
    }

    pushNode(node: TreeNode<K>): TreeNode<K> | null {
        if (!node.isTwoNode()) throw new Error("Can't push a three node");

        if (this.isTwoNode()) {
            switch (node.childType) {
                case ChildType.left: {
                    this.largeItem = this.smallItem;
                    this.smallItem = node.smallItem;

                    this.middleChild.parent= this
                    this.middleChild.childType= ChildType.right
                    this.rightChild = this.middleChild;

                    node.middleChild.parent= this
                    node.middleChild.childType= ChildType.middle
                    this.middleChild = node.middleChild;

                    node.leftChild.parent= this
                    node.leftChild.childType= ChildType.left
                    this.leftChild = node.leftChild;
                    break
                }
                case ChildType.middle: {
                    //this.smallItem = this.largeItem;
                    this.largeItem = node.smallItem;

                    node.middleChild.parent= this
                    node.middleChild.childType= ChildType.right
                    this.rightChild = node.middleChild;

                    node.leftChild.parent= this
                    node.leftChild.childType= ChildType.middle
                    this.middleChild = node.leftChild;
                    break
                }
            }
            return null;
        }

        //Pushing to a three node will cause it tho split
        let newNode: TreeNode<K>;
        let newRightNode: TreeNode<K>;
        let newLeftNode: TreeNode<K>;

        switch (node.childType) {
            case ChildType.left: {
                newNode = new TreeNode<K>(this.smallItem);
                newLeftNode = new TreeNode<K>(node.smallItem);
                newRightNode = new TreeNode<K>(this.largeItem);

                newNode.parent = this.parent;
                newNode.childType = this.childType;

                newLeftNode.parent = newNode;
                newLeftNode.childType = ChildType.left;

                newRightNode.parent = newNode;
                newRightNode.childType = ChildType.middle;
                

                node.leftChild.parent= newLeftNode
                node.leftChild.childType= ChildType.left
                newLeftNode.leftChild = node.leftChild;

                node.middleChild.parent= newLeftNode
                node.middleChild.childType= ChildType.middle
                newLeftNode.middleChild = node.middleChild;
                
                this.middleChild.parent= newRightNode
                this.middleChild.childType= ChildType.left
                newRightNode.leftChild = this.middleChild;

                this.rightChild.parent= newRightNode
                this.rightChild.childType= ChildType.middle
                newRightNode.middleChild = this.rightChild;
                break
            }

            case ChildType.middle: {
                newNode = new TreeNode<K>(node.smallItem);
                newLeftNode = new TreeNode<K>(this.smallItem);
                newRightNode = new TreeNode<K>(this.largeItem);

                newNode.parent = this.parent;
                newNode.childType = this.childType;

                newLeftNode.parent = newNode;
                newLeftNode.childType = ChildType.left;

                newRightNode.parent = newNode;
                newRightNode.childType = ChildType.middle;

                
                this.leftChild.parent= newLeftNode
                this.leftChild.childType= ChildType.left
                newLeftNode.leftChild = this.leftChild;

                node.leftChild.parent= newLeftNode
                node.leftChild.childType= ChildType.middle
                newLeftNode.middleChild = node.leftChild;

                node.middleChild.parent= newRightNode
                node.middleChild.childType= ChildType.left
                newRightNode.leftChild = node.middleChild;

                this.rightChild.parent= newRightNode
                this.rightChild.childType= ChildType.middle
                newRightNode.middleChild = this.rightChild;
                break
            }

            case ChildType.right: {
                newNode = new TreeNode<K>(this.largeItem);
                newLeftNode = new TreeNode<K>(this.smallItem);
                newRightNode = new TreeNode<K>(node.smallItem);

                newNode.parent = this.parent;
                newNode.childType = this.childType;

                newLeftNode.parent = newNode;
                newLeftNode.childType = ChildType.left;

                newRightNode.parent = newNode;
                newRightNode.childType = ChildType.middle;
                
                
                this.leftChild.parent= newLeftNode
                this.leftChild.childType= ChildType.left
                newLeftNode.leftChild = this.leftChild;
                
                this.middleChild.parent= newLeftNode
                this.middleChild.childType= ChildType.middle
                newLeftNode.middleChild = this.middleChild;

                node.leftChild.parent= newRightNode
                node.leftChild.childType= ChildType.left
                newRightNode.leftChild = node.leftChild;

                node.middleChild.parent= newRightNode
                node.middleChild.childType= ChildType.middle
                newRightNode.middleChild = node.middleChild;

                break
            }
        }
        newNode.leftChild= newLeftNode
        newNode.middleChild= newRightNode
        return newNode;
    }
}

export default class Tree23<K> implements Tree<K>{
    protected root: TreeNode<K> | null = null;
    protected size: number = 0;

    add(item: K) {
        if(this.exists(item, this.root)){
            return
        }
            
        if (!this.root) this.root = new TreeNode<K>(item);
        else {
            this.addItem(item, this.root);
        }
        this.size++;
        this.checkTreeConnections(this.root)
        console.log("added",item)
    }

    getSize(){
        return this.size
    }

    clear(): void {
        this.size= 0
        this.root= null
    }

    remove(data: K): void {
        //TODO
    }

    setHeights(node: TreeNode<K>): number{
        if(!node)
            return 0
        
        let leftHeight= this.setHeights(node.leftChild)
        let middleHeight= this.setHeights(node.middleChild)
        let rightHeight= this.setHeights(node.rightChild)
        node.height= Math.max(leftHeight, middleHeight, rightHeight)

        return node.height+1
    }

    drawTree(ctx: CanvasRenderingContext2D, width: number): void {
        let radius = width / 27;
        let initialPos = new Vector(width / 2,  Math.max(3.5 * radius, 100));
        this.setHeights(this.root)
        this.drawTreeHelper(this.root, initialPos, radius, 0, ctx);
    }

    private drawTreeHelper(
        node: TreeNode<K>,
        pos: Vector,
        radius: number,
        level: number,
        ctx: CanvasRenderingContext2D
    ) {
        if(!node) return
        
        let xOff= 2*radius* ((node.height)**2)
        let xOff2Node= xOff/2

        if(node.isTwoNode()){
            // let leftPos = pos.copy()
            // leftPos.add((-radius * 70)/ (level + 2) ** 2.7, radius * 2.7)

            // let rightPos = pos.copy()
            // rightPos.add((radius * 70)/ (level + 2) ** 2.7, radius * 2.7)



            let leftPos = pos.copy()
            leftPos.add(-xOff2Node, radius * 3)

            let rightPos = pos.copy()
            rightPos.add(xOff2Node, radius * 3)

            //draw lines connecting nodes
            if (node.leftChild) {
                ctx.beginPath(); // Start a new path
                ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
                ctx.lineTo(leftPos.x, leftPos.y); // Draw a line to (150, 100)
                ctx.lineWidth= 5
                ctx.strokeStyle = "#9dcded";
                ctx.stroke();
            }
            if (node.middleChild){
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
            ctx.fillText(node.smallItem.toString(), pos.x, pos.y);
            ctx.fill();

            //draw child trees
            this.drawTreeHelper(node.leftChild, leftPos, radius, level + 1, ctx);
            this.drawTreeHelper(node.middleChild, rightPos, radius, level + 1, ctx);
        }
        else{

            // let leftPos3 = pos.copy()
            // leftPos3.add((-radius * 100)/ (level + 2) ** 2.7, radius * 2.7)

            // let rightPos3 = pos.copy()
            // rightPos3.add((radius * 100)/ (level + 2) ** 2.7, radius * 2.7)

            let leftPos3 = pos.copy()
            leftPos3.add(-xOff, radius * 3)

            let rightPos3 = pos.copy()
            rightPos3.add(xOff, radius * 3)

            let middlePos3= pos.copy()
            middlePos3.add(0,radius*3)

             //draw lines connecting nodes
             if (node.leftChild) {
                ctx.beginPath(); // Start a new path
                ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
                ctx.lineTo(leftPos3.x, leftPos3.y); // Draw a line to (150, 100)
                ctx.lineWidth= 5
                ctx.strokeStyle = "#9dcded";
                ctx.stroke();
            }
            if (node.middleChild){
                ctx.beginPath(); // Start a new path
                ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
                ctx.lineTo(middlePos3.x, middlePos3.y); // Draw a line to (150, 100)
                ctx.lineWidth= 5
                ctx.strokeStyle = "#9dcded";
                ctx.stroke();
            }
            if(node.rightChild){
                ctx.beginPath(); // Start a new path
                ctx.moveTo(pos.x, pos.y); // Move the pen to (30, 50)
                ctx.lineTo(rightPos3.x, rightPos3.y); // Draw a line to (150, 100)
                ctx.lineWidth= 5
                ctx.strokeStyle = "#9dcded";
                ctx.stroke();
            }

            // START DRAW THE NODE
            let h= radius
            let w= 2*radius
            let r = h / 2;
            let x= pos.x- w/2
            let y= pos.y- h/2


            ctx.fillStyle = "#172026";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#9dcded";

            ctx.beginPath();
            ctx.moveTo(x+r, y);
            ctx.arcTo(x+w, y,   x+w, y+h, r);
            ctx.arcTo(x+w, y+h, x,   y+h, r);
            ctx.arcTo(x,   y+h, x,   y,   r);
            ctx.arcTo(x,   y,   x+w, y,   r);
            ctx.closePath();

            ctx.fill()
            ctx.stroke()
            //END DRAW NODE


            //Draw the items
            ctx.font = (radius/2.5).toString()+"px Courier New";
            ctx.fillStyle = "white";
            ctx.textAlign= "center";
            ctx.textBaseline = 'middle';

            ctx.beginPath();
            ctx.fillText(node.smallItem.toString(), pos.x -radius/2, pos.y);
            ctx.fill();

            ctx.beginPath(); 
            ctx.fillText(node.largeItem.toString(), pos.x +radius/2, pos.y);
            ctx.fill();


            //draw child trees
            this.drawTreeHelper(node.leftChild, leftPos3, radius, level + 1, ctx);
            this.drawTreeHelper(node.middleChild, middlePos3, radius, level + 1, ctx);
            this.drawTreeHelper(node.rightChild, rightPos3, radius, level + 1, ctx);
        }
    }

    private exists(item: K, node: TreeNode<K>): boolean{
        if(!node)
            return false
        if(node.smallItem === item || node.largeItem === item){
            console.log("Duplicate", item)
            return true
        }
            
        if (item < node.smallItem) 
            return this.exists(item, node.leftChild);
        else if (node.isTwoNode() || item < node.largeItem) 
            return this.exists(item, node.middleChild);
        else 
            return this.exists(item, node.rightChild);
    }

    addItem(item: K, node: TreeNode<K> | null) {
        //Base case
        if (node.isLeafNode()) {
            let splittedNode = node.addItem(item);
            if (splittedNode) {
                this.handleSplits(splittedNode);
            }
            return;
        }

        //Search for the appropriate spot
        if (item < node.smallItem) this.addItem(item, node.leftChild);
        else if (node.isTwoNode() || item < node.largeItem) this.addItem(item, node.middleChild);
        else this.addItem(item, node.rightChild);
    }

    handleSplits(node: TreeNode<K>) {
        //Base case 1, no further parent element
        if (!node.parent) {
            this.root = node;
            return;
        }

        let splittedNode = node.parent.pushNode(node);

        if (splittedNode) {
            this.handleSplits(splittedNode);
        }
    }
    checkTreeConnections(node: TreeNode<K>| null){
        if(!node) return 

        if(node.leftChild){
            let c= node.leftChild
            console.assert(c.childType == ChildType.left,"Wrong child type on",c)
            console.assert(c.parent == node,"Wrong parent on",c)
            
        }
        if(node.middleChild){
            let c= node.middleChild
            console.assert(c.childType == ChildType.middle,"Wrong child type on",c)
            console.assert(c.parent == node,"Wrong parent on",c)
        }
        if(node.rightChild){
            let c= node.rightChild
            console.assert(c.childType == ChildType.right,"Wrong child type on",c)
            console.assert(c.parent == node,"Wrong parent on",c)
        }

        if(!node.isLeafNode){
            this.checkTreeConnections(node.leftChild)
            this.checkTreeConnections(node.middleChild)
            this.checkTreeConnections(node.rightChild)
        }
    }
}
