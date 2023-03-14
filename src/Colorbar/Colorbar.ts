import { Graph2D, Graph2D_State, RecursivePartial } from "../Graph2D/Graph2D_Types";
import { Colorbar, Colorbar_Data, Colorbar_Options, Colorbar_State, Colorbar_Ticks } from "./Colorbar_Types";
import ComputeColorbar from "./resourses/Compute_Colorbar/Compute_Colorbar.js";
import DrawColorbar from "./resourses/Draw_Colorbar/Draw_Colorbar.js";

const defaultOptions : Colorbar_Options = {
    enable : true,
    reverse : false,
    width : 20,
    size : 0.93,
    unit : "",
    opacity : 1,
    position : "x-end",
    ticks : 7,
    border : {
        color : "#000000",
        opacity : 1,
        style : "solid", 
        width : 1
    },
    floating : {
        x : 0,
        y : 0,
        orientation : "vertical"
    },
    label : {
        color : "#000000",
        font : "Arial, Helvetica Neue, Helvetica, sans-serif",
        size : "10px",
        opacity : 1,
        position : "out",
        width : 1,
        title : "Bar Title"
    },
    data : [
        {color : "#440154", label:"0", position:0},
        {color : "#37598c", label:"0.33", position:0.33},
        {color : "#53c567", label:"0.66", position:0.66},
        {color : "#fde724", label:"1", position:1}        
    ]
}

function ColorBar(options : RecursivePartial<Colorbar_Options>, state : Graph2D_State, graphHandler : Graph2D ) : [Colorbar, ()=>void/*draw*/ , ()=>void/*compute*/]{
//---------------------------------------------
    //state of the colorbar
    const barState : Colorbar_State = {
        id : crypto.randomUUID(),
        absoluteSize : {width: 0, height:0},
        gradient : [],
        textOffset : 4,
        ...defaultOptions,
        ...options,
        ticks : options.ticks==null? defaultOptions.ticks : options.ticks as Colorbar_Ticks,
        data : options.data==null? defaultOptions.data : options.data as Colorbar_Data,
        border : {...defaultOptions.border, ...options.border},
        floating : {...defaultOptions.floating, ...options.floating},
        label : {...defaultOptions.label, ...options.label},
    }


    //Main handler
    const barHandler : RecursivePartial<Colorbar> = {};

    //Method generators
    const barCompute = ComputeColorbar({barHandler, barState, graphHandler, state});
    const barDraw = DrawColorbar({barHandler, barState, graphHandler, state});

    //Main object population


//---------------------------------------------

    return [barHandler as Colorbar, barDraw.draw, barCompute.compute]
}

export default ColorBar;