export interface Mapping_Props {
    from : [number, number],
    to : [number, number],
    type ?: "linear" | "log",
    base ?: number
}

export interface Mapping{
    map : (value:number)=>number,
    invert : (value:number)=>number
}