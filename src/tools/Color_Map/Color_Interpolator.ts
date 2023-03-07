import { Color_Interpolator, Color_Interpolator_Props, Color_To_Space, hsvColor, labColor, lchColor, rgbColor, Space_To_Color, xyzColor } from "./Color_Interpolator_Types";

function colorInterpolator({from, space="lch", to} : Color_Interpolator_Props) : Color_Interpolator{
    const rgbA = string2rgb(to[0]);
    const rgbB = string2rgb(to[1]);

    let color2space : Color_To_Space = (arg)=>[0,0,0];
    let space2color : Space_To_Color = (arg)=>{return{r:0, g:0, b:0}};

    switch(space){
        case "rgb":
            color2space = color=>[color.r, color.g, color.b];
            space2color = inSpace=>{return {r:inSpace[0], g:inSpace[1], b:inSpace[2]}};
            break;
        
        case "hsv":
            color2space = color=>{
                const toHSV = rgb2hsv(color);
                return [toHSV.h, toHSV.s, toHSV.v];
            }
            space2color = inSpace=>hsv2rgb({h:inSpace[0], s:inSpace[1], v:inSpace[2]});
            break;

        case "xyz":
            color2space = color=>{
                const toXYZ = rgb2xyz(color);
                return [toXYZ.x , toXYZ.y, toXYZ.z];
            }
            space2color = inSpace => xyz2rgb({x:inSpace[0], y:inSpace[1], z:inSpace[2]})
            break;

        case "lab":
            color2space = color=>{
                const toXYZ = rgb2xyz(color);
                const toLAb = xyz2lab(toXYZ);
                return [toLAb.l, toLAb.a, toLAb.b];
            }
            space2color = inSpace=>{
                const toXYZ = lab2xyz({l:inSpace[0], a:inSpace[1], b:inSpace[2]});
                return xyz2rgb(toXYZ);
            }
            break;

        case "lch":
            color2space = color=>{
                const toXYZ = rgb2xyz(color);
                const toLAb = xyz2lab(toXYZ);
                const toLCH = lab2lch(toLAb)
                return [toLCH.l, toLCH.c, toLCH.h];
            }
            space2color = inSpace=>{
                const toLAB = lch2lab({l:inSpace[0], c:inSpace[1], h:inSpace[2]});
                const toXYZ = lab2xyz(toLAB);
                return xyz2rgb(toXYZ);
            }
            break;
    }

    const colorA = color2space(rgbA);
    const colorB = color2space(rgbB);


//---------------------------------------------

    function map(value:number) : string{
        const t = (value - from[0])/(from[1] - from[0]);
        const interpolation : [number, number, number] = [0,0,0];

        interpolation[0] = colorA[0] + (colorB[0] - colorA[0])*t;
        interpolation[1] = colorA[1] + (colorB[1] - colorA[1])*t;
        interpolation[2] = colorA[2] + (colorB[2] - colorA[2])*t;

        const toRGB = space2color(interpolation);
        return rgb2string(toRGB);
    }


//---------------------------------------------

    return {
        map,
        domain : [from[0], from[1]],
        range : [to[0], to[1]],
        space
    }
}

export default colorInterpolator;












//------------ Space Conversions --------------
//------------- String To RGB -----------------
function string2rgb(color:string) : rgbColor{
    return {
        r : parseInt(color.replace("#","").slice(0,2), 16),
        g : parseInt(color.replace("#","").slice(2,4), 16),
        b : parseInt(color.replace("#","").slice(4,6), 16),
    }
}
//---------------------------------------------
//------------- RGB to String -----------------
export function rgb2string(color:rgbColor):string{
    //8 bit colors only
    const candidate : rgbColor = {
        r : Math.round(color.r),
        g : Math.round(color.g),
        b : Math.round(color.b),
    }

    const rString = candidate.r<16 ? `0${candidate.r.toString(16)}` : candidate.r.toString(16);
    const gString = candidate.g<16 ? `0${candidate.g.toString(16)}` : candidate.g.toString(16);
    const bString = candidate.b<16 ? `0${candidate.b.toString(16)}` : candidate.b.toString(16);

    return `#${rString}${gString}${bString}`
}
//---------------------------------------------
//-------------- RGB To HSV -------------------
function rgb2hsv(color:rgbColor) : hsvColor{
    const tolerance = 0.00001;
    
    const R = color.r/255;
    const G = color.g/255;
    const B = color.b/255;
    const cMax = Math.max(R,G,B);
    const cMin = Math.min(R,G,B);
    const delta = cMax - cMin;

    let h : number = 0;
    //Compute h in degrees
    if(Math.abs(delta) < tolerance)
        h = 0;
    else if(Math.abs(cMax-R)<tolerance)
        h = (G-B)/delta;
    else if(Math.abs(cMax-G)<tolerance)
        h = (B-R)/delta + 2
    else if(Math.abs(cMax-B)<tolerance)
        h = (R-G)/delta + 4

    h = h<0? h%6 + 6 : h%6;  // h ==> [0, 6]
    h = h<=3? Math.PI*h/3 : Math.PI*((h-3)/3 - 1); // h ==> [-pi, pi]

    const s = cMax === 0? 0 : delta/cMax;
    const v = cMax;

    return {h, s, v}

}
//---------------------------------------------
//------------- HSV to RGB --------------------
export function hsv2rgb(color:hsvColor):rgbColor{
    const H = color.h<0 ? 3/Math.PI*color.h+6 : Math.PI/3*color.h   // h ==> [0, 6]
    const S = color.s;
    const V = color.v;
    const alpha = V * (1 - S);
    const beta = V * (1 - (H - Math.floor(H))*S);
    const gamma = V * (1 - (1 - (H - Math.floor(H)))*S);

    let r = 0;
    let g = 0;
    let b = 0;

    if(H>=0 && H<1){
        r = V;
        g = gamma;
        b = alpha;
    }else if(H>=1 && H<2){
        r = beta;
        g = V;
        b = alpha;
    }else if(H>=2 && H<3){
        r = alpha;
        g = V;
        b = gamma;
    }else if(H>=3 && H<4){
        r = alpha;
        g = beta;
        b = V;
    }else if(H>=4 && H<5){
        r = gamma;
        g = alpha;
        b = V;
    }else if(H>=5 && H<6){
        r = V;
        g = alpha;
        b = beta;
    }

    r *= 255;
    g *= 255;
    b *= 255;

    return {r, g, b}
}
//---------------------------------------------
//-------------- RGB To XYZ -------------------
function rgb2xyz(color:rgbColor) : xyzColor{
    const R = gammaExpansion(color.r);
    const G = gammaExpansion(color.g);
    const B = gammaExpansion(color.b);

    const x = R*0.4124108464885388   + G*0.3575845678529519  + B*0.18045380393360833;
    const y = R*0.21264934272065283  + G*0.7151691357059038  + B*0.07218152157344333;
    const z = R*0.019331758429150258 + G*0.11919485595098397 + B*0.9503900340503373;

    return {x, y, z};
}
//---------------------------------------------
//-------------- XYZ to RGB -------------------
function xyz2rgb(color:xyzColor) : rgbColor{
    let r = gammaCompresion(color.x* 3.240812398895283    - color.y*1.5373084456298136  - color.z*0.4985865229069666);
    let g = gammaCompresion(color.x*-0.9692430170086407   + color.y*1.8759663029085742  + color.z*0.04155503085668564);
    let b = gammaCompresion(color.x* 0.055638398436112804 - color.y*0.20400746093241362 + color.z*1.0571295702861434);
    
    r = r<0? 0 : (r>255? 255 : r);
    g = g<0? 0 : (g>255? 255 : g);
    b = b<0? 0 : (b>255? 255 : b);
    
    return {r, g, b};
}
//---------------------------------------------
//-------------- XYZ To LAB -------------------
function xyz2lab(color:xyzColor) : labColor{
    const Xw = 0.9504492182750991;
    const Yw = 1;
    const Zw = 1.0889166484304715;
    
    const fx = labTransform(color.x / Xw); 
    const fy = labTransform(color.y / Yw); 
    const fz = labTransform(color.z / Zw);
    
    const l = 116*fy - 16;
    const a = 500*(fx - fy);
    const b = 200*(fy - fz);

    return {l, a, b};
}
//---------------------------------------------
//-------------- LAB To XYZ -------------------
function lab2xyz(color:labColor) : xyzColor{
    const Xw = 0.9504492182750991;
    const Yw = 1;
    const Zw = 1.0889166484304715;
   
    const fy = (color.l + 16) / 116;
    const fx = color.a/500 + fy;
    const fz = fy - color.b/200;

    const x = inverseLabTransform(fx) * Xw;
    const y = inverseLabTransform(fy) * Yw;
    const z = inverseLabTransform(fz) * Zw;

    return {x, y, z}
}
//---------------------------------------------
//-------------- LAB To LCH -------------------
function lab2lch(color:labColor) : lchColor{
    const l = color.l;
    const c = Math.hypot(color.a, color.b);
    let h = Math.atan2(color.b, color.a);

    return {l, c, h};
}
//---------------------------------------------
//------------- LCH To LAB --------------------
function lch2lab(color:lchColor) : labColor{
    const l = color.l;
    const a = color.c * Math.cos(color.h);
    const b = color.c * Math.sin(color.h);

    return {l, a, b};
}
//---------------------------------------------







//------------- Gamma Expansion ---------------
function gammaExpansion(value:number) : number{
    if(value <= 10)
        return value/3294.6;

    return Math.pow((value+14.025)/269.025, 12/5);
}
//---------------------------------------------
//---------------------------------------------
function gammaCompresion(value:number) : number{
    const S = 0.00313066844250060782371;

    if(value <= S)
        return Math.round(3294.6*value);

    return Math.round(269.025 * Math.pow(value, 5/12) - 14.025);
}
//---------------------------------------------
//------------- LAB Transform -----------------
function labTransform(value:number) : number{
    const epsilon = 216/24389;
    const kappa = 24389/27;

    if(value <= epsilon)
        return (kappa*value + 16)/116;
    
    return Math.pow(value, 1/3);
}
//---------------------------------------------
//--------- Inverse LAB Transform -------------
function inverseLabTransform(value:number) : number{
    const kappa = 24389/27;
    const epsilon = 6/29;

    if(value > epsilon)
        return Math.pow(value, 3);

    return (116*value - 16)/kappa;
}
//---------------------------------------------

