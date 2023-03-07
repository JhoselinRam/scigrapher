export type Color_Map = (value:number)=>string; 

export interface Color_Map_Props {
    type : Color_Map_types,
    from : number,
    to : number
}

export type Color_Map_types = "viridis" | "plasma" | "magma" |                                              //Secuential 
                              "magnet" | "inv_magnet" | "fairy" | "inv_fairy" | "swamp" | "inv_swamp" |     //Diverging
                              "fire" | "royal" | "hsv"