import { Graph2D, Graph2D_Options, Graph2D_State, LabelProperties, RecursivePartial, RequiredExept, Secondary_Axis } from "./Graph2D_Types";
import Axis from "./resourses/Axis/Axis.js";
import Background from "./resourses/Background/Background.js";
import Labels from "./resourses/Labels/Labels.js";
import Scale from "./resourses/Scale/Scale.js";

const defaultOptions : Graph2D_Options = {
    background : {
        color : "#ffffff",
        opacity : 1
    },
    canvas : {
        marginStart : 5,
        marginEnd : 5,
        marginTop : 5,
        marginBottom : 5
    },
    axis : {
        position : "center",
        type : "rectangular",
        x : {
            start : -5,
            end: 5,
            unit : "",
            baseColor : "#000000",
            baseOpacity : 1,
            tickColor : "#000000",
            tickOpacity : 1,
            textColor : "#000000",
            textOpacity : 1,
            dynamic : true,
            contained : false
        },
        y : {
            start : -5,
            end: 5,
            unit : "",
            baseColor : "#000000",
            baseOpacity : 1,
            tickColor : "#000000",
            tickOpacity : 1,
            textColor : "#000000",
            textOpacity : 1,
            dynamic : true,
            contained : false
        },
    },
    secondary : {},
    labels : {}
};

const defaultSecondaryAxis : Secondary_Axis = {
    enable : true,
    type : "rectangular",
    unit : "",
    start : -5,
    end : 5,
    baseColor : "#000000",
    baseOpacity : 1,
    tickColor : "#000000",
    tickOpacity : 1,
    textColor : "#000000",
    textOpacity : 1
};

const defaultLabel : LabelProperties = {
    font : "15px Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
    color : "#000000",
    filled : true,
    opacity : 1,
    position : "center",
    text : "",
    enable : true
}

export function Graph2D(container:HTMLDivElement, options:RecursivePartial<Graph2D_Options> = {}) : Graph2D{
    //Combines the options object with the default options
    const state : RequiredExept<Graph2D_State, "compute" | "scale" | "secondary" | "labels" | "context" | "draw" | "axisObj"> = { 
        container,
        render,
        scale : {},
        compute:{
            full : fullCompute
        },
        draw : {
            full : fullDraw,
            client : drawClientArea
        },
        context : {
            clientRect : {
                x : 0,
                y : 0,
                width  : container.clientWidth,
                height : container.clientHeight
            }
        },
        axisObj : {},
        background : {...defaultOptions.background, ...options.background},
        canvas : {...defaultOptions.canvas, ...options.canvas},
        axis : {
            ...defaultOptions.axis,
            ...options.axis,
            x : {
                ...defaultOptions.axis.x,
                ...options.axis?.x
            },
            y : {
                ...defaultOptions.axis.y,
                ...options.axis?.y
            },
        },
        secondary : {
            x : options.secondary?.x === null ? undefined : {...defaultSecondaryAxis, ...options.secondary?.x},
            y : options.secondary?.y === null ? undefined : {...defaultSecondaryAxis, ...options.secondary?.y}
        },
        labels : {
            title : options.labels?.title === null ? undefined : {
                ...defaultLabel, 
                font:"25px Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
                position:"start", 
                ...options.labels?.title
            },
            subtitle : options.labels?.subtitle === null ? undefined : {
                ...defaultLabel, 
                position:"start", 
                ...options.labels?.subtitle
            },
            xPrimary : options.labels?.xPrimary === null ? undefined : {...defaultLabel, ...options.labels?.xPrimary},
            yPrimary : options.labels?.yPrimary === null ? undefined : {...defaultLabel, ...options.labels?.yPrimary},
            xSecondary : options.labels?.xSecondary === null ? undefined : {...defaultLabel, ...options.labels?.xSecondary},
            ySecondary : options.labels?.ySecondary === null ? undefined : {...defaultLabel, ...options.labels?.ySecondary},
        }
    };

    //Main graph object
    const graphHandler : RecursivePartial<Graph2D> = {}; 

    //Method generators
    const background = Background({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const scale  = Scale({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const axis = Axis({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const labels = Labels({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});

    //State optional properties population
    state.compute.scale = scale.compute;
    state.compute.axis = axis.compute;
    state.compute.labels = labels.compute;
    state.draw.background = background.draw;
    state.draw.backgroundClientRect = background.drawClientRect;
    state.draw.labels = labels.draw;
    state.draw.axis = axis.draw;


    //Main object population
    graphHandler.backgroundColor = background.backgroundColor;
    graphHandler.backgroundOpacity = background.backgroundOpacity;
    graphHandler.title = labels.title;
    graphHandler.subtitle = labels.subtitle;
    graphHandler.xLabel = labels.xLabel;
    graphHandler.yLabel = labels.yLabel;
    graphHandler.xLabelSecondary = labels.xLabelSecondary;
    graphHandler.yLabelSecondary = labels.yLabelSecondary;


    //Setup configurations
    setup();
    render();

    //Main render function
    function render(){
        fullCompute();
        fullDraw();
    }

    //Helper function, compute all properties
    function fullCompute(){
        const fullState = state as Graph2D_State;

        fullState.compute.labels();
        fullState.compute.scale();
        fullState.compute.axis();
    }

    //Helper function, draws all elements.
    function fullDraw(){
        const fullState = state as Graph2D_State;

        fullState.draw.background();
        fullState.draw.labels();
        fullState.draw.client();
    }

    //Helper function, draws only the client area
    function drawClientArea(){
        const fullState = state as Graph2D_State;

        fullState.draw.backgroundClientRect();
        fullState.draw.axis();
    }

    //Helper function, set the container properties and adds the canvas element
    function setup(){
        const width = state.container.clientWidth;
        const height = state.container.clientHeight;
        const newCanvas = document.createElement("canvas");
        
        newCanvas.width = width;
        newCanvas.height = height;

        state.container.appendChild(newCanvas);
        state.context.canvas = newCanvas.getContext("2d") as CanvasRenderingContext2D;
    }


    //---------------------------------------------


    return graphHandler as Graph2D
}