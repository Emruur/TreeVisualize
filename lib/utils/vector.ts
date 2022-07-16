export default class Vector{
    x: number
    y: number

    constructor(x:number,y:number){
        this.x= x
        this.y= y
    }

    copy(): Vector{
        return new Vector(this.x, this.y)
    }

    add(x: number, y: number)
    {
        this.x += x
        this.y += y
    }
}