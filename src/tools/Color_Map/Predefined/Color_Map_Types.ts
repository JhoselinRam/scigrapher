export type Color_Map = (value:number)=>string; 

export interface Color_Map_Props {
    type : Color_Map_types,
    from : number,
    to : number
}

export type Color_Map_types = "viridis" | "plasma" | "magma"