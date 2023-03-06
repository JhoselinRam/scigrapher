import colorInterpolator from "../Color_Interpolator.js";
import { Color_Map, Color_Map_Props } from "./Color_Map_Types";

function colorMap({type, from, to} : Color_Map_Props) : Color_Map{
    let map : Color_Map;

    switch(type){
        case "plasma":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#440154";
                const colorB = "#fde724";

                const interpolator = colorInterpolator({from:[0, 1], to:[colorA, colorB]});
                return interpolator.map(t);
            }
            break;
        
        case "viridis":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#440154";
                const colorB = "#24838d";
                const colorC = "#fde724";

                const interpolatorA = colorInterpolator({from:[0, 0.5], to:[colorA, colorB], space:"lab"});
                const interpolatorB = colorInterpolator({from:[0.5 ,1], to:[colorB, colorC], space:"lab"});

                return t<0.5? interpolatorA.map(t) : interpolatorB.map(t);
            }
            break;

        case "magma":
            map = value=>{
                const t = (value - from)/(to - from);
                const colorA = "#000000";
                const colorB = "#842681";
                const colorC = "#f8755c";
                const colorD = "#fbfcbf";

                const interpolatorA = colorInterpolator({from:[0, 1/3], to:[colorA, colorB], space:"lch"});
                const interpolatorB = colorInterpolator({from:[1/3, 2/3], to:[colorB, colorC], space:"lch"});
                const interpolatorC = colorInterpolator({from:[2/3, 1], to:[colorC, colorD], space:"lch"});

                return t<1/3 ? interpolatorA.map(t):
                        t<2/3 ? interpolatorB.map(t):
                        interpolatorC.map(t);
            }
            break;




        default : 
            map = value=>"#000000";
    }

    return map;
} 

export default colorMap;