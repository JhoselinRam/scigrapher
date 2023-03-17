import { Field_Property } from "../../Data/Data_Types";
import { Heat_Map_State, Heat_Property_Generator } from "../../Data/HeatMap/Heat_Map_Types";
import colorMap from "../Color_Map/Predefined/Color_Map.js";

//------------- Get Line Dash -----------------
export function getLineDash(style : string) : Array<number> {
    let lineDash : Array<number> //style = "solid";

    switch(style){
        case "solid":
            lineDash = [];
            break;

        case "dot":
            lineDash = [2, 3];
            break;
        
        case "dash":
            lineDash = [5, 3];
            break;
        
        case "long-dash":
            lineDash = [8, 3];
            break;

        case "dash-dot":
            lineDash = [5, 3, 2, 3];
            break;

        case "dash-2dot":
            lineDash = [6, 3, 2, 3, 2, 3];
            break;
        
        default:
            lineDash = style.split(" ").map(item=>parseInt(item));
            break;
    }

    return lineDash;
}
//---------------------------------------------
//-------------- Is Callable ------------------

export function isCallable(candidate : unknown) :  candidate is Function{
    return typeof candidate === "function";
}

//---------------------------------------------
//--------------- Linspace --------------------

export function linspace(start:number, end:number, n:number) : Array<number> {
    const ans : Array<number> = [];
    const delta = (end - start)/(n-1);
    
    for(let i=0; i<n; i++)
        ans.push(start+i*delta);

    return ans;
}

//---------------------------------------------
//--------------- Meshgrid --------------------
export interface Mesh_Axis_Generator {start:number, end:number, n:number};
export type Mesgrid = [Array<Array<number>>, Array<Array<number>>];

export function meshgrid(x:Array<number>, y:Array<number>) : Mesgrid;
export function meshgrid(x:Mesh_Axis_Generator, y:Mesh_Axis_Generator) : Mesgrid;
export function meshgrid(x:Array<number> | Mesh_Axis_Generator, y:Array<number> | Mesh_Axis_Generator) : Mesgrid{
    const xMesh : Array<Array<number>> = [];
    const yMesh : Array<Array<number>> = [];
    const xCoords = Array.isArray(x)? x : linspace(x.start, x.end, x.n);
    const yCoords = Array.isArray(y)? y : linspace(y.start, y.end, y.n);
    yCoords.reverse();

    for(let j=0; j<yCoords.length; j++){
        xMesh.push(xCoords.slice());
        yMesh.push([]);
        for(let i=0; i<xCoords.length; i++)
            yMesh[j].push(yCoords[j]);
    }


    return [xMesh, yMesh];
}

//---------------------------------------------
//------------- Color Function ----------------

export interface Get_Color_Function{
    data : Field_Property<number>,
    dataState : Heat_Map_State
}

export function getColorFunction({data, dataState} : Get_Color_Function) : Heat_Property_Generator<string> {
    let colorFunction : Heat_Property_Generator<string> = ()=>"";

    if(typeof dataState.color === "string"){
        let min = data[0][0];
        let max = data[0][0];

        for(let i=0; i<data.length; i++){
            for(let j=0; j<data[i].length; j++){
                if(data[i][j] < min)
                    min = data[i][j];
                if(data[i][j] > max)
                    max = data[i][j];
            }
        }

        const cmap = colorMap({from:min, to:max, type:dataState.color});
        colorFunction = value=>cmap(value as number);
    }else if(isCallable(dataState.color)){
        colorFunction =  dataState.color;
    }else if(typeof dataState.color === "object"){
        colorFunction = (value, x, y, i, j)=>(dataState.color as Field_Property<string>)[i as number][j as number];
    }

    return colorFunction;
}

//---------------------------------------------
//-------------- Get Text Size ----------------

interface Text_Size {width:number, height:number};

export function getTextSize(text:string, size:string, font:string, context:CanvasRenderingContext2D) : Text_Size{
    context.save();

    context.font = `${size} ${font}`;
    const metric = context.measureText(text);
    const width = metric.width;
    const height = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;

    context.restore();

    return {width, height};
}

//---------------------------------------------
//---------------------------------------------

export function formatNumber(value : number, maxDecimals:number) : string{
    let label : string = "";
        const magnitudeOrder = value===0? 0 : Math.floor(Math.log10(Math.abs(value)));
     
        if(magnitudeOrder<-2 || magnitudeOrder>3){
            const fixed = Number.isInteger(value/Math.pow(10,magnitudeOrder)) ? 0 : maxDecimals;
            let temp = value.toExponential(fixed).split("e");
            if(fixed === maxDecimals){
                for(let i=0; i<maxDecimals; i++){
                    if(!temp[0].endsWith("0"))
                        break;
                    temp[0] = temp[0].slice(0,-1);
                }
            }
            label = temp.join("e");
            label = label.replace("e","x10").replace("-", "– ");

        }
        else{
            const fixed = Number.isInteger(value) ? 0 : maxDecimals;
            let temp = value.toFixed(fixed);
            //Remove tailing ceros.
            if(fixed === maxDecimals){
                for(let i=0; i<maxDecimals; i++){
                    if(!temp.endsWith("0"))
                        break;     
                    temp = temp.slice(0, -1);
                    }
            }
            label = temp
            label = label.replace("-", "– ");
            
            if(Math.abs(value)>999){
                const caracteres = label.split("");
                const commaIndex = label.includes("– ") ? 3 : 1; 
                caracteres.splice(commaIndex,0,",");
                label = caracteres.join("");
            }
        }

        return label;
}

//---------------------------------------------