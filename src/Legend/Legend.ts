import { Graph2D, Graph2D_State, RecursivePartial } from "../Graph2D/Graph2D_Types";
import ComputeLegend from "./Compute_Legend/Compute_Legend.js";
import LegendDraw from "./Draw_Legend/Draw_Legend.js";
import { Legend, Legend_Data_Entrie, Legend_Options, Legend_Position, Legend_State } from "./Legend_Types";
import LegendProperties from "./Properties_Legend/Properties_Legend.js";


const defaultOptions : Legend_Options = {
    enable : true,
    background : {
         color : "#ffffff",
         opacity : 1
    },
    border : {
        color : "#000000",
        opacity : 1,
        style : "solid",
        width : 1
    },
    columns : 1,
    data : [],
    margin : 5,
    position : "top-right",
    title : {
        text : "",
        color : "#000000",
        font : "Arial, Helvetica Neue, Helvetica, sans-serif",
        size : "12px",
        opacity : 1,
        position : "start"
    },
    width : 30
}


function newLegend(options : RecursivePartial<Legend_Options>, state : Graph2D_State, graphHandler : Graph2D ) : [Legend, ()=>void/*draw*/]{
//---------------------------------------------
    //State of the legend
    const legendState : Legend_State = {
        id : crypto.randomUUID(),
        metrics : {
            x : 0,
            y : 0,
            height : 0,
            width : 0,
            textOffset : 5,
            items : []
        },
        compute : ()=>{},
        ...defaultOptions, ...options,
        background : {...defaultOptions.background, ...options.background},
        border : {...defaultOptions.border, ...options.border},
        title : {...defaultOptions.title, ...options.title},
        data : options.data == null ? defaultOptions.data : options.data as Array<Legend_Data_Entrie>,
        position : options.position == null ? defaultOptions.position : options.position as Legend_Position
    }


    //Main handler object
    const legendHandler : Partial<Legend> = {};

    //Method generators
    const draw = LegendDraw({legendHandler:legendHandler as Legend, legendState: legendState as Legend_State, state, graphHandler});
    const compute = ComputeLegend({legendHandler:legendHandler as Legend, legendState: legendState as Legend_State, state, graphHandler});
    const properties = LegendProperties({legendHandler:legendHandler as Legend, legendState: legendState as Legend_State, state, graphHandler});


    legendState.compute = compute.compute;

    //Main object population
    legendHandler.id = ()=>legendState.id;
    legendHandler.background = properties.background;
    legendHandler.border = properties.border;
    legendHandler.columns = properties.columns;
    legendHandler.enable = properties.enable;
    legendHandler.margin = properties.margin;
    legendHandler.title = properties.title;
    legendHandler.width = properties.width;
    legendHandler.data = properties.data;
    legendHandler.position = properties.position;
    legendHandler.metrics = properties.metrics;


//---------------------------------------------

    return [legendHandler as Legend, draw.draw];
}

export default newLegend;