import { Graph2D, Graph2D_State, RecursivePartial } from "../Graph2D/Graph2D_Types";
import { Colorbar, Colorbar_Data, Colorbar_Options, Colorbar_State, Colorbar_Ticks } from "./Colorbar_Types";
import ComputeColorbar from "./resourses/Compute_Colorbar/Compute_Colorbar.js";
import DrawColorbar from "./resourses/Draw_Colorbar/Draw_Colorbar.js";
import ColorbarProperties from "./resourses/Properties_Colorbar/Properties_Colorbar.js";
import ColorbarText from "./resourses/Text_Colorbar/Text_Colorbar.js";

const defaultOptions : Colorbar_Options = {
    enable : true,
    reverse : false,
    width : 20,
    size : 0.93,
    unit : "",
    opacity : 1,
    position : "x-end",
    ticks : {
        density : 5,
        color : "#000000",
        opacity : 1,
        style : "solid", 
        width : 1
    },
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
        position : "end",
        filled : true
    },
    title : {
        text : "Bar Title",
        color : "#000000",
        font : "Arial, Helvetica Neue, Helvetica, sans-serif",
        size : "12px",
        opacity : 1,
        position : "end",
        filled : true,
        reverse : false
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
        metrics : {width: 0, height:0, barCoord:0, labelCoord:0, titleCoord:0},
        gradient : {
            entries : [],
            gradientObject : state.context.data.createLinearGradient(0,0,0,0)
        },
        textOffset : 4,
        ...defaultOptions,
        ...options,
        ticks : {...defaultOptions.ticks, ...options.ticks, density:options.ticks?.density==null? defaultOptions.ticks.density : options.ticks.density as Colorbar_Ticks},
        data : options.data==null? defaultOptions.data : options.data as Colorbar_Data,
        border : {...defaultOptions.border, ...options.border},
        floating : {...defaultOptions.floating, ...options.floating},
        label : {...defaultOptions.label, ...options.label},
        title : {...defaultOptions.title, ...options.title},
    }


    //Main handler
    const barHandler : RecursivePartial<Colorbar> = {};

    //Method generators
    const barCompute = ComputeColorbar({barHandler:barHandler as Colorbar, barState, graphHandler, state});
    const barDraw = DrawColorbar({barHandler:barHandler as Colorbar, barState, graphHandler, state});
    const text = ColorbarText({barHandler:barHandler as Colorbar, barState, graphHandler, state});
    const properties = ColorbarProperties({barHandler:barHandler as Colorbar, barState, graphHandler, state});

    //Main object population
    barHandler.text = text.text;
    barHandler.label = text.label;
    barHandler.title = text.title;
    barHandler.enable = properties.enable;
    barHandler.reverse = properties.reverse;
    barHandler.opacity = properties.opacity;
    barHandler.size = properties.size;
    barHandler.width = properties.width;
    barHandler.position = properties.position;
    barHandler.unit = properties.unit;


//---------------------------------------------

    return [barHandler as Colorbar, barDraw.draw, barCompute.compute]
}

export default ColorBar;