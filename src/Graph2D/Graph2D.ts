import { Graph2D, Graph2D_Options, Graph2D_State, RecursivePartial, RecursiveRequired, RequiredExept } from "./Graph2D_Types";
import Background from "./resourses/background/Background.js";

const defaultOptions : Graph2D_Options = {
    background : {
        color : "#ffffff",
        opacity : 1
    },
    scale : {
        xStart : -5,
        xEnd : 5,
        yStart : -5,
        yEnd : 5,
        marginStart : 5,
        marginEnd : 5,
        marginTop : 5,
        marginBottom : 5
    }
}

export function Graph2D(container:HTMLDivElement, options:RecursivePartial<Graph2D_Options> = {}) : Graph2D{
type test = {compute:{
    scale:()=>void
}}
    const state : RecursiveRequired<Graph2D_State> = { //State of the whole graph
        container,
        render,
        id : crypto.randomUUID(),
        background : Object.assign(defaultOptions.background, options.background),
        scale : Object.assign(defaultOptions.scale, options.scale)
    };

    const graphHandler : RecursivePartial<Graph2D> = {}; //Main graph object

    //Method generators
    const background = Background({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});

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
    }


    return graphHandler as Graph2D
}