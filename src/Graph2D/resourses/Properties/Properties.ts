import { Graph2D, Graph2D_Options, Graph2D_Save_Asset, Graph2D_Save_Graph, Method_Generator, Rect, Secondary_Axis } from "../../Graph2D_Types";
import { Graph2D_Mappings, Properties } from "./Properties_Types";

function Properties({graphHandler, state} : Method_Generator) : Properties {

//------------- Canvas Elements --------------- 

    function canvasElements() : Array<HTMLCanvasElement>{
        return [state.canvasElement, state.canvasDataElement];
    }

//--------------------------------------------- 
//-------------- Client Rect ------------------ 

    function clientRect() : Rect{
        return {...state.context.clientRect};
    }

//--------------------------------------------- 
//----------------- Draw ---------------------- 

    function draw() : Graph2D {
        state.draw.full();
        return graphHandler;
    }

//--------------------------------------------- 
//-------------- Graph Rect ------------------- 

    function graphRect() : Rect{
        const rect = {...state.context.clientRect};

        switch(state.axis.position){
            case "center":
                rect.x += state.marginUsed.x.start;
                rect.y += state.marginUsed.y.end;
                rect.width -= state.marginUsed.x.start + state.marginUsed.x.end;
                rect.height -= state.marginUsed.y.start + state.marginUsed.y.end;
                break;
                
            case "bottom-left":
                rect.x += state.marginUsed.x.start + state.axisObj.primary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.secondary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "bottom-right":
                rect.x += state.marginUsed.x.start + state.axisObj.secondary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.secondary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;
            
            case "top-left":
                rect.x += state.marginUsed.x.start + state.axisObj.primary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.primary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "top-right":
                rect.x += state.marginUsed.x.start + state.axisObj.secondary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.primary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;
            
        }

        return rect;
    }

//--------------------------------------------- 
//------------ Mapping ------------------------ 

    function mapping() : Graph2D_Mappings{
        return {
            primary : {...state.scale.primary},
            secondary : {...state.scale.secondary}
        }
    }

//--------------------------------------------- 
//----------------- Save ---------------------- 

    function save() : Graph2D_Save_Graph{
        const graph : Graph2D_Options = {
            background : {...state.background},
            margin : {
                x : {...state.margin.x},
                y : {...state.margin.y}
            },
            axis :{
                ...state.axis,
                x : {...state.axis.x},
                y : {...state.axis.y},
            },
            secondary : {
                x : state.secondary.x == undefined? undefined : {...state.secondary.x},
                y : state.secondary.y == undefined? undefined : {...state.secondary.y}
            },
            labels : {
                title : state.labels.title == undefined? undefined : {...state.labels.title},
                subtitle : state.labels.subtitle == undefined? undefined : {...state.labels.subtitle},
                xPrimary : state.labels.xPrimary == undefined? undefined : {...state.labels.xPrimary},
                yPrimary : state.labels.yPrimary == undefined? undefined : {...state.labels.yPrimary},
                xSecondary : state.labels.xSecondary == undefined? undefined : {...state.labels.xSecondary},
                ySecondary : state.labels.ySecondary == undefined? undefined : {...state.labels.ySecondary},
            },
            grid :{
                ...state.grid,
                primary : {
                    x : {...state.grid.primary.x},
                    y : {...state.grid.primary.y},
                },
                secondary : {
                    x : {...state.grid.secondary.x},
                    y : {...state.grid.secondary.y},
                }
            },
            border : {
                x : {
                    start : {...state.border.x.start},
                    end : {...state.border.x.end},
                },
                y : {
                    start : {...state.border.y.start},
                    end : {...state.border.y.end},
                }
            }
        }

        const datasets = state.data.map(set=>set.save());
        const colorbars = state.colorbars.map(set=>set.save());
        const legends = state.legends.map(set=>set.save());

        return {
            graph,
            assets : ([] as Array<Graph2D_Save_Asset>).concat(...datasets, ...colorbars, ...legends)
        }
    }

//--------------------------------------------- 

    return {
        canvasElements,
        clientRect,
        draw,
        graphRect,
        mapping,
        save
    }
}

export default Properties;