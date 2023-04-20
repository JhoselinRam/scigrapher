import { Graph2D, Graph2D_Save_Callback, Graph2D_State, RecursivePartial } from "../Graph2D/Graph2D_Types";
import { Colorbar, Colorbar_Data, Colorbar_Options, Colorbar_Position, Colorbar_State, Colorbar_Ticks } from "./Colorbar_Types";
import ComputeColorbar from "./resourses/Compute_Colorbar/Compute_Colorbar.js";
import ColorbarData from "./resourses/Data_Colorbar/Data_Colorbar.js";
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
        density : 6,
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
    label : {
        color : "#000000",
        font : "Arial, Helvetica Neue, Helvetica, sans-serif",
        size : "10px",
        specifier : "",
        opacity : 1,
        position : "end"
        },
    title : {
        text : "",
        color : "#000000",
        font : "Arial, Helvetica Neue, Helvetica, sans-serif",
        size : "12px",
        specifier : "",
        opacity : 1,
        position : "end",
        reverse : false
    },
    data : "",
    id : "auto"
}

function ColorBar(options : RecursivePartial<Colorbar_Options>, state : Graph2D_State, graphHandler : Graph2D ) : [Colorbar, ()=>void/*draw*/ , ()=>void/*compute*/, Graph2D_Save_Callback]{
//---------------------------------------------
    //state of the colorbar
    const barState : Colorbar_State = {
        ...defaultOptions, ...options,
        id : (options.id!=null && options.id!=="auto")? options.id : crypto.randomUUID(),
        metrics : {width: 0, height:0, barCoord:0, labelCoord:0, titleCoord:0, position :{x:0, y:0}},
        gradient : {
            entries : [],
            gradientObject : state.context.data.createLinearGradient(0,0,0,0)
        },
        textOffset : 4,
        position : options.position==null? defaultOptions.position : options.position as Colorbar_Position,
        ticks : {...defaultOptions.ticks, ...options.ticks, density:options.ticks?.density==null? defaultOptions.ticks.density : options.ticks.density as Colorbar_Ticks},
        data : options.data==null? defaultOptions.data : options.data as Colorbar_Data,
        border : {...defaultOptions.border, ...options.border},
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
    const data = ColorbarData({barHandler:barHandler as Colorbar, barState, graphHandler, state});

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
    barHandler.border = properties.border;
    barHandler.ticks = properties.ticks;
    barHandler.id = properties.id;
    barHandler.metrics = properties.metrics;
    barHandler.data = data.data;


//---------------------------------------------

    return [barHandler as Colorbar, barDraw.draw, barCompute.compute, properties.save]
}

export default ColorBar;