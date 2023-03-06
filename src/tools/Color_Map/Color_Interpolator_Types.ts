export type Color_Space = "rgb" | "hsv" | "xyz" | "lab" | "lch";

export interface Color_Interpolator_Props {
    from : [number, number],
    to : [string, string],
    space ?: Color_Space
}


export interface Color_Interpolator{
    map : (value:number) => string,
    domain : [number, number],
    range : [string, string],
    space : Color_Space
}

export interface rgbColor{
    r : number,     //[0,255]
    g : number,     //[0,255]
    b : number      //[0,255]
}

export interface hsvColor{
    h : number,     //[-pi,pi]
    s : number,     //[0,1]
    v : number      //[0,1]
}

export interface xyzColor{
    x : number,
    y : number,
    z : number
}

export interface labColor{
    l : number,
    a : number,
    b : number
}

export interface lchColor{
    l : number,
    c : number,
    h : number
}





export type Color_To_Space = (color:rgbColor)=>[number, number, number];
export type Space_To_Color = (inSpace:[number, number, number])=>rgbColor;
