import { Graph2D, Graph2D_Options, Graph2D_State, RecursivePartial, RequiredExept } from "./Graph2D_Types";
import Axis from "./resourses/Axis/Axis.js";
import Background from "./resourses/Background/Background.js";
import Scale from "./resourses/Scale/Scale.js";

const defaultOptions : RequiredExept<Graph2D_Options, "secondary"> = {
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
        xStart : -5,
        xEnd : 5,
        yStart : -5,
        yEnd : 5,
        position : "center",
        type : "rectangular",
        xUnit : "",
        yUnit : "",
        xBaseColor : "#ffffff",
        xBaseOpacity : 1,
        xTickColor : "#ffffff",
        xTickOpacity : 1,
        xLabelColor : "#ffffff",
        xLabelOpacity : 1,
        yBaseColor : "#ffffff",
        yBaseOpacity : 1,
        yTickColor : "#ffffff",
        yTickOpacity : 1,
        yLabelColor : "#ffffff",
        yLabelOpacity : 1,
        xContained : false,
        xDynamic : true,
        yContained : false,
        yDynamic : true,
    },
    secondary : {}
}

export function Graph2D(container:HTMLDivElement, options:RecursivePartial<Graph2D_Options> = {}) : Graph2D{
    //State of the whole graph
    const state : RequiredExept<Graph2D_State, "compute" | "scale" | "secondary"> = { 
        container,
        render,
        fullCompute,
        secondaryEnabled: {x:false, y:false},
        id : crypto.randomUUID(),
        scale : {},
        compute:{},
        background : Object.assign(defaultOptions.background, options.background),
        canvas : Object.assign(defaultOptions.canvas, options.canvas),
        axis : Object.assign(defaultOptions.axis, options.axis),
        secondary : Object.assign(defaultOptions.secondary, options.secondary)
    };

    //Main graph object
    const graphHandler : RecursivePartial<Graph2D> = {}; 

    //Method generators
    const background = Background({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const scale  = Scale({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const axis = Axis({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});

    //State optional properties population
    state.compute.scale = scale.compute;
    state.compute.axis = axis.compute;
    state.scale.primary = scale.primary;
    state.scale.secondary = scale.secondary;
    state.scale.reference = scale.reference;


    //Main object population
    graphHandler.backgroundColor = background.backgroundColor;
    graphHandler.getBackgroundColor = background.getBackgroundColor;
    graphHandler.opacity = background.opacity;
    graphHandler.getOpacity = background.getOpacity;

    //First graph render
    render();

    //Main render function
    function render(){
        state.container.style.backgroundColor = state.background.color;
        state.container.style.opacity = `${state.background.opacity}`;

        fullCompute();
    }

    //Aux Function, help compute all properties
    function fullCompute(){
        const fullState = state as Graph2D_State;

        fullState.compute.scale();
        fullState.compute.axis();
    }


    return graphHandler as Graph2D
}