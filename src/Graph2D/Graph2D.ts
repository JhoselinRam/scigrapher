import { Graph2D, Graph2D_Options, Graph2D_State, LabelProperties, Rect, RecursivePartial, RequiredExept, Secondary_Axis } from "./Graph2D_Types";
import Axis from "./resourses/Axis/Axis.js";
import Background from "./resourses/Background/Background.js";
import Border from "./resourses/Border/Border.js";
import Colorbars from "./resourses/Colorbars/Colorbars.js";
import Data from "./resourses/Data/Data.js";
import Events from "./resourses/Events/Events.js";
import Grid from "./resourses/Grid/Grid.js";
import Labels from "./resourses/Labels/Labels.js";
import Legends from "./resourses/Legends/Legends.js";
import Margin from "./resourses/Margin/Margin.js";
import Properties from "./resourses/Properties/Properties.js";
import Scale from "./resourses/Scale/Scale.js";
import Secondary from "./resourses/Secondary/Secondary.js";

const defaultOptions : Graph2D_Options = {
    background : { color : "#ffffff", opacity : 1 },
    margin : {
        x : { start : "auto", end : "auto" },
        y : { start : "auto", end : "auto" }
    },
    axis : {
        position : "center",
        type : "rectangular",
        overlapPriority : "x",
        x : {
            start : -5,
            end: 5,
            unit : "",
            baseColor : "#000000",
            baseOpacity : 1,
            baseWidth : 1,
            tickColor : "#000000",
            tickOpacity : 1,
            tickWidth : 1,
            tickSize : 5,
            textColor : "#000000",
            textOpacity : 1,
            textFont : "Arial, Helvetica Neue, Helvetica, sans-serif",
            textSize : "10px",
            dynamic : true,
            contained : true,
            ticks : "auto",
            minSpacing : 45,
            overlap : true
        },
        y : {
            start : -5,
            end: 5,
            unit : "",
            baseColor : "#000000",
            baseOpacity : 1,
            baseWidth : 1,
            tickColor : "#000000",
            tickOpacity : 1,
            tickWidth : 1,
            tickSize : 5,
            textColor : "#000000",
            textOpacity : 1,
            textFont : "Arial, Helvetica Neue, Helvetica, sans-serif",
            textSize : "10px",
            dynamic : true,
            contained : true,
            ticks : "auto",
            minSpacing : 45,
            overlap : true
        },
    },
    secondary : {},
    labels : {},
    grid : {
        polarGrid : 16,
        primary : {
            x : {
                enable : true,
                color : "#000000",
                opacity : 0.2,
                style : "solid",
                width : 1,
            },
            y : {
                enable : true,
                color : "#000000",
                opacity : 0.2,
                style : "solid",
                width : 1,
            }
        }, 
        secondary : {
            x : {
                enable : true,
                color : "#000000",
                opacity : 0.1,
                style : "dot",
                width : 1,
                density : "auto",
                maxDensity : 5,
                minSpacing : 20,
            },
            y : {
                enable : true,
                color : "#000000",
                opacity : 0.1,
                style : "dot",
                width : 1,
                density : "auto",
                maxDensity : 5,
                minSpacing : 20,
            }
        }
    },
    border : {
        x : {
            start : {
                enable : false,
                color : "#000000",
                opacity : 1,
                width : 1,
                style : "solid"
            },
            end : {
                enable : false,
                color : "#000000",
                opacity : 1,
                width : 1,
                style : "solid"
            }
        },
        y : {
            start : {
                enable : false,
                color : "#000000",
                opacity : 1,
                width : 1,
                style : "solid"
            },
            end : {
                enable : false,
                color : "#000000",
                opacity : 1,
                width : 1,
                style : "solid"
            }
        }
    }
};

const defaultSecondaryAxis : Secondary_Axis = {
    enable : true,
    type : "rectangular",
    unit : "",
    start : -5,
    end : 5,
    baseColor : "#000000",
    baseOpacity : 1,
    baseWidth : 1,
    tickColor : "#000000",
    tickOpacity : 1,
    tickWidth : 1,
    tickSize : 5,
    textColor : "#000000",
    textOpacity : 1,
    textFont : "Arial, Helvetica Neue, Helvetica, sans-serif",
    textSize : "10px",
    ticks : "auto",
    minSpacing : 45
};

const defaultLabel : LabelProperties = {
    font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
    size : "15px",
    color : "#000000",
    filled : true,
    opacity : 1,
    position : "center",
    text : "",
    enable : true
}

export function graph2D(container:HTMLDivElement, options:RecursivePartial<Graph2D_Options> = {}) : Graph2D{
    //Combines the options object with the default options
    const state : RequiredExept<Graph2D_State, "compute" | "scale"  | "labels" | "context" | "draw" | "axisObj"> = { 
        container,
        canvasElement : document.createElement("canvas"),
        canvasDataElement : document.createElement("canvas"),
        render,
        labelOffset : 4,
        scale : {},
        compute:{
            full : fullCompute,
            client : computeClient
        },
        draw : {
            full : fullDraw,
            client : drawClientArea,
            data : drawData
        },
        context : {
            clientRect : {
                x : 0,
                y : 0,
                width  : container.clientWidth,
                height : container.clientHeight
            }
        },
        marginUsed : {
            defaultMargin : 5,
            x : {start : 0, end : 0},
            y : {start : 0, end : 0}
        },
        axisObj : {},
        data : [],
        dirty : {
            full : true,
            client : true,
            data : false,
            shouldSort : false,
            dirtify
        },
        colorbars : [],
        legends : [],
        background : {...defaultOptions.background, ...options.background},
        margin : {
            x : {...defaultOptions.margin.x, ...options.margin?.x},
            y : {...defaultOptions.margin.y, ...options.margin?.y}
        },
        axis : {
            ...defaultOptions.axis,
            ...options.axis,
            x : {
                ...defaultOptions.axis.x,
                ...options.axis?.x,
                ticks : options.axis?.x?.ticks!=null ? options.axis.x.ticks as "auto"|number|number[] : defaultOptions.axis.x.ticks
            },
            y : {
                ...defaultOptions.axis.y,
                ...options.axis?.y,
                ticks : options.axis?.y?.ticks!=null ? options.axis.y.ticks as "auto"|number|number[] : defaultOptions.axis.y.ticks
            },
        },
        secondary : {
            x : options.secondary?.x == null ? undefined : {
                ...defaultSecondaryAxis, 
                ...options.secondary?.x,
                ticks : options.secondary?.x?.ticks!=undefined ? options.secondary.x.ticks as "auto"|number|number[] : defaultSecondaryAxis.ticks
            },
            y : options.secondary?.y == null ? undefined : {
                ...defaultSecondaryAxis, 
                ...options.secondary?.y,
                ticks : options.secondary?.y?.ticks!=undefined ? options.secondary.y.ticks as "auto"|number|number[] : defaultSecondaryAxis.ticks
            }
        },
        labels : {
            title : options.labels?.title == null ? undefined : {
                ...defaultLabel, 
                size:"25px",
                position:"start", 
                ...options.labels?.title
            },
            subtitle : options.labels?.subtitle == null ? undefined : {
                ...defaultLabel, 
                position:"start", 
                ...options.labels?.subtitle
            },
            xPrimary : options.labels?.xPrimary == null ? undefined : {...defaultLabel, ...options.labels?.xPrimary},
            yPrimary : options.labels?.yPrimary == null ? undefined : {...defaultLabel, ...options.labels?.yPrimary},
            xSecondary : options.labels?.xSecondary == null ? undefined : {...defaultLabel, ...options.labels?.xSecondary},
            ySecondary : options.labels?.ySecondary == null ? undefined : {...defaultLabel, ...options.labels?.ySecondary},
        },
        grid : {
            polarGrid : options.grid?.polarGrid != null ? options.grid?.polarGrid : defaultOptions.grid.polarGrid,
            primary : {
                x : {...defaultOptions.grid.primary.x, ...options.grid?.primary?.x},
                y : {...defaultOptions.grid.primary.y, ...options.grid?.primary?.y}
            },
            secondary : {
                x : {...defaultOptions.grid.secondary.x, ...options.grid?.secondary?.x},
                y : {...defaultOptions.grid.secondary.y, ...options.grid?.secondary?.y}
            }
        },
        border : {
            x  : {start : {...defaultOptions.border.x.start, ...options.border?.x?.start}, end:{...defaultOptions.border.x.end, ...options.border?.x?.end}},
            y  : {start : {...defaultOptions.border.y.start, ...options.border?.y?.start}, end:{...defaultOptions.border.y.end, ...options.border?.y?.end}}
        }
    };

    //Main graph object
    const graphHandler : RecursivePartial<Graph2D> = {}; 

    //Method generators
    const background = Background({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const scale  = Scale({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const axis = Axis({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const labels = Labels({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const margin = Margin({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const grid = Grid({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const secondary = Secondary({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const events  = Events({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const data = Data({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const properties = Properties({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const border = Border({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const colorbars = Colorbars({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});
    const legends = Legends({state: state as Graph2D_State, graphHandler:graphHandler as Graph2D});

    //State optional properties population
    state.compute.scale = scale.compute;
    state.compute.axis = axis.compute;
    state.compute.secondary = secondary.compute;
    state.compute.labels = labels.compute;
    state.compute.margin = margin.compute;
    state.draw.background = background.draw;
    state.draw.backgroundClientRect = background.drawClientRect;
    state.draw.labels = labels.draw;
    state.draw.axis = axis.draw;
    state.draw.secondary = secondary.draw;
    state.draw.grid = grid.draw;
    state.draw.border = border.draw;
    state.context.graphRect = properties.graphRect;


    //Main object population
    graphHandler.backgroundColor = background.backgroundColor;
    graphHandler.backgroundOpacity = background.backgroundOpacity;
    graphHandler.title = labels.title;
    graphHandler.subtitle = labels.subtitle;
    graphHandler.xLabel = labels.xLabel;
    graphHandler.yLabel = labels.yLabel;
    graphHandler.xLabelSecondary = labels.xLabelSecondary;
    graphHandler.yLabelSecondary = labels.yLabelSecondary;
    graphHandler.axisPosition = axis.axisPosition;
    graphHandler.axisType = axis.axisType;
    graphHandler.axisDomain = axis.axisDomain;
    graphHandler.axisColor = axis.axisColor;
    graphHandler.axisOpacity = axis.axisOpacity;
    graphHandler.axisUnits = axis.axisUnits;
    graphHandler.axisBase = axis.axisBase;
    graphHandler.axisTicks = axis.axisTicks;
    graphHandler.axisText = axis.axisText;
    graphHandler.axisDynamic = axis.axisDynamic;
    graphHandler.axisOverlap = axis.axisOverlap;
    graphHandler.margin = margin.margin;
    graphHandler.gridColor = grid.gridColor;
    graphHandler.gridOpacity = grid.gridOpacity;
    graphHandler.gridStyle = grid.gridStyle;
    graphHandler.gridWidth = grid.gridWidth;
    graphHandler.primaryGrid = grid.primaryGrid;
    graphHandler.secondaryGrid = grid.secondaryGrid;
    graphHandler.polarGrid = grid.polarGrid;
    graphHandler.secondaryAxisEnable = secondary.secondaryAxisEnable;
    graphHandler.secondaryAxisDomain = secondary.secondaryAxisDomain;
    graphHandler.secondaryAxisColor = secondary.secondaryAxisColor;
    graphHandler.secondaryAxisOpacity = secondary.secondaryAxisOpacity;
    graphHandler.secondaryAxisUnits = secondary.secondaryAxisUnits;
    graphHandler.secondaryAxisBase = secondary.secondaryAxisBase;
    graphHandler.secondaryAxisTicks = secondary.secondaryAxisTicks;
    graphHandler.secondaryAxisText = secondary.secondaryAxisText;
    graphHandler.secondaryAxisType = secondary.secondaryAxisType;
    graphHandler.aspectRatio = events.aspectRatio;
    graphHandler.pointerMove = events.pointerMove;
    graphHandler.pointerZoom = events.pointerZoom;
    graphHandler.containerResize = events.containerResize;
    graphHandler.addDataset = data.addDataset;
    graphHandler.getDatasets = data.getDatasets;
    graphHandler.removeDataset = data.removeDataset;
    graphHandler.canvasElements = properties.canvasElements;
    graphHandler.clientRect = properties.clientRect;
    graphHandler.graphRect = properties.graphRect;
    graphHandler.draw = properties.draw;
    graphHandler.coordinateMaps = properties.coordinateMaps;
    graphHandler.save = properties.save;
    graphHandler.containerSize = properties.containerSize;
    graphHandler.border = border.border;
    graphHandler.addColorbar = colorbars.addColorbar;
    graphHandler.removeColorbar = colorbars.removeColorbar;
    graphHandler.getColorbars = colorbars.getColorbars;
    graphHandler.addLegend = legends.addLegend;
    graphHandler.removeLegend = legends.removeLegend;
    graphHandler.getLegends = legends.getLegends;

    
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
        fullState.compute.client();
    }
    
    function computeClient(){
        const fullState = state as Graph2D_State;

        fullState.compute.margin();
        fullState.colorbars.forEach(colorbar=>colorbar.compute());
        fullState.compute.scale();
        fullState.compute.axis();   
        fullState.compute.secondary();   
    }

    //Helper function, draws all elements.
    function fullDraw(){
        const fullState = state as Graph2D_State;
        
        if(fullState.dirty.full){
            fullState.draw.background();
            fullState.draw.labels();
        }
        fullState.draw.client();
    }

    //Helper function, draws only the client area
    function drawClientArea(){
        const fullState = state as Graph2D_State;

        if(fullState.dirty.full || fullState.dirty.client){
            fullState.draw.backgroundClientRect();
            fullState.draw.grid();
            fullState.draw.axis();
            fullState.draw.secondary();
            fullState.draw.border();
        }
        fullState.draw.data();
    }
    
    //Helper function, draws only the data
    function drawData(){
        const fullState = state as Graph2D_State;
        
        if(fullState.dirty.full || fullState.dirty.client || fullState.dirty.data){
            if(fullState.dirty.shouldSort) fullState.data.sort((a,b) => a.dataset.index() - b.dataset.index());
            
            fullState.context.data.clearRect(0,0,fullState.context.data.canvas.width, fullState.context.data.canvas.height);
            fullState.data.forEach(item => item.draw(fullState));
            fullState.colorbars.forEach(colorbar=>colorbar.draw());
            fullState.legends.forEach(legend=>legend.draw());
        }
        
        fullState.dirty.full = false;
        fullState.dirty.client = false;
        fullState.dirty.data = false;
    }

    //Helpler function, makes the data dirty so it can be redraw
    function dirtify(sort?:boolean){
        state.dirty.data = true
        if(sort != null) state.dirty.shouldSort = true;
    }

    //Helper function, set the container properties and adds the canvas element
    function setup(){
        const width = 500;
        const height = 500;


        state.container.style.width = `${width}px`;
        state.container.style.height = `${height}px`;
        const dpi = window.devicePixelRatio;

        state.container.style.position = "relative";
        
        state.canvasElement.style.width = `${width}px`;
        state.canvasElement.style.height = `${height}px`;
        state.canvasElement.width = width*dpi;
        state.canvasElement.height = height*dpi;
        state.canvasElement.style.position = "absolute";
        
        state.canvasDataElement.style.width = `${width}px`;
        state.canvasDataElement.style.height = `${height}px`;
        state.canvasDataElement.width = width*dpi;
        state.canvasDataElement.height = height*dpi;
        state.canvasDataElement.style.position = "absolute";

        state.container.appendChild(state.canvasElement);
        state.container.appendChild(state.canvasDataElement);

        state.context.canvas = state.canvasElement.getContext("2d") as CanvasRenderingContext2D;
        state.context.canvas.scale(dpi, dpi);
        state.context.canvas.imageSmoothingEnabled = false;
        
        state.context.data = state.canvasDataElement.getContext("2d", {willReadFrequently: true}) as CanvasRenderingContext2D;
        state.context.data.scale(dpi, dpi);
        state.context.data.imageSmoothingEnabled = false;
    }

    return graphHandler as Graph2D
}