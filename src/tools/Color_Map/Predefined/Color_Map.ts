import colorInterpolator, { hsv2rgb, rgb2string } from "../Color_Interpolator.js";
import { Color_Map, Color_Map_Props } from "./Color_Map_Types";

function colorMap({type, from, to} : Color_Map_Props) : Color_Map{
    let map : Color_Map;

    switch(type){
        case "plasma":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#440154";
                const colorB = "#fde724";

                const interpolator = colorInterpolator({from:[0, 1], to:[colorA, colorB], space:"lch"});
                return interpolator.map(t);
            }
            break;
        
        case "viridis":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#440154";
                const colorB = "#37598c";
                const colorC = "#53c567";
                const colorD = "#fde724";

                const interpolatorA = colorInterpolator({from:[0, 1/3], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/3, 2/3], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[2/3, 1], to:[colorC, colorD], space:"lab"});

                return t<1/3 ? interpolatorA.map(t):
                        t<2/3 ? interpolatorB.map(t):
                        interpolatorC.map(t);
            }
            break;

        case "magma":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#000000";
                const colorB = "#842681";
                const colorC = "#f8755c";
                const colorD = "#fbfcbf";

                const interpolatorA = colorInterpolator({from:[0, 1/3], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/3, 2/3], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[2/3, 1], to:[colorC, colorD], space:"lab"});

                return t<1/3 ? interpolatorA.map(t):
                        t<2/3 ? interpolatorB.map(t):
                        interpolatorC.map(t);
            }
            break;

        case "magnet":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#00004c";
                const colorB = "#0000ef";
                const colorC = "#ffffff";
                const colorD = "#f40000";
                const colorE = "#7f0000";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "inv_magnet":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#0000ef";
                const colorB = "#00004c";
                const colorC = "#000000";
                const colorD = "#7f0000";
                const colorE = "#f40000";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "fairy":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#40004b";
                const colorB = "#ae8cbe";
                const colorC = "#f6f6f6";
                const colorD = "#70bb73";
                const colorE = "#00441b";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "inv_fairy":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#ae8cbe";
                const colorB = "#40004b";
                const colorC = "#060606";
                const colorD = "#00441b";
                const colorE = "#70bb73";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "swamp":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#00441b";
                const colorB = "#70bb73";
                const colorC = "#f6f6f6";
                const colorD = "#fffb7c";
                const colorE = "#fde724";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "inv_swamp":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#70bb73";
                const colorB = "#00441b";
                const colorC = "#060606";
                const colorD = "#fde724";
                const colorE = "#fffb7c";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"lab"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"lab"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"lab"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "fire":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#f40000";
                const colorB = "#fc7835";
                const colorC = "#fde724";
                const colorD = "#fc7835";
                const colorE = "#f40000";

                const interpolatorA = colorInterpolator({from:[0, 1/4], to:[colorA, colorB], space:"rgb"});
                const interpolatorB = colorInterpolator({from:[1/4, 1/2], to:[colorB, colorC], space:"rgb"});
                const interpolatorC = colorInterpolator({from:[1/2, 3/4], to:[colorC, colorD], space:"rgb"});
                const interpolatorD = colorInterpolator({from:[3/4, 1], to:[colorD, colorE], space:"rgb"});

                return t<1/4? interpolatorA.map(t) :
                        t<1/2? interpolatorB.map(t) :
                        t<3/4? interpolatorC.map(t) :
                        interpolatorD.map(t);
            }
            break;
            
        case "royal":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#f40000";
                const colorB = "#0000f4";
                const colorC = "#f40000";

                const interpolatorA = colorInterpolator({from:[0, 1/2], to:[colorA, colorB], space:"rgb"});
                const interpolatorB = colorInterpolator({from:[1/2, 1], to:[colorB, colorC], space:"rgb"});
            
                return t<1/2? interpolatorA.map(t) : interpolatorB.map(t);
            }
            break;
            
        case "hsv":
            map = value=>{
                const t = (value - from)/(to - from);
                
                let h = 2*Math.PI*(t-1);

                const toRGB = hsv2rgb({h, s:1, v:1});
                return rgb2string(toRGB);
            }
            break;



















        default : 
            map = value=>"#000000";
    }

    return map;
} 

export default colorMap;