export interface Scale_Props {
    from : [number, number],
    to : [number, number],
    type : "linear" | "log"
}

export interface Scale{
    map : (value:number)=>number,
    invert : (value:number)=>number
}