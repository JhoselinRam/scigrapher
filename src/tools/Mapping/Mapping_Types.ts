export interface Mapping_Props {
    from : [number, number],
    to : [number, number],
    type ?: Mapping_Type,
    base ?: number
}

export interface Mapping{
    map : (value:number)=>number,
    invert : (value:number)=>number,
    domain : [number, number],
    range : [number, number],
    type : Mapping_Type,
    base ?: number
}

export type Mapping_Type = "linear" | "log" | "sqr"