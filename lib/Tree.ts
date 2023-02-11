export default interface Tree<TreeType>
{
    add(data: TreeType): void
    remove(data: TreeType): void
    drawTree(ctx: CanvasRenderingContext2D, width: number): void
    clear():void
}