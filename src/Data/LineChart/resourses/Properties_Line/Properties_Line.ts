import { Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types";
import { Line_Chart, Line_Chart_Callback, Line_Chart_Method_Generator, Line_Chart_Options, Marker_Type} from "../../LineChart_Types";
import { Properties_Line } from "./Properties_Line_Types";

function LineProperties({dataHandler, dataState, graphHandler} : Line_Chart_Method_Generator) : Properties_Line{

//----------------- Polar ---------------------

function polar(polar : boolean, callback?:Line_Chart_Callback) : Line_Chart;
function polar(arg : void) : boolean;
function polar(polar : boolean | void, callback?:Line_Chart_Callback) : Line_Chart | boolean | undefined{
    if(typeof polar === "undefined" && callback == null)
        return dataState.polar;

    if(typeof polar === "boolean"){
        if(polar === dataState.polar) return dataHandler;

        dataState.polar = polar;
        if(callback != null) callback(dataHandler, graphHandler);
        dataState.dirtify();

        return dataHandler;
    }
}

//---------------------------------------------
//----------------- Save ----------------------

    function save() : Graph2D_Save_Asset{
        const options : Line_Chart_Options = {
            polar : dataState.polar,
            useAxis : {...dataState.useAxis},
            marker : {
                enable : dataState.marker.enable,
                color : dataHandler.markerColor(),
                filled : dataHandler.markerFilled(),
                size : dataHandler.markerSize(),
                opacity : dataHandler.markerOpacity(),
                style : dataHandler.markerStyle(),
                width : dataHandler.markerWidth(),
                type : dataHandler.markerType() as Marker_Type|Array<Marker_Type>,
            },
            line : {
                enable : dataState.line.enable,
                color : dataHandler.lineColor(),
                opacity : dataHandler.lineOpacity(),
                style : dataHandler.lineStyle(),
                width : dataHandler.lineWidth(),
            },
            errorBar : {
                type : dataState.errorBar.type,
                x : {
                    enable : dataState.errorBar.x.enable,
                    color : dataHandler.errorbarColorX(),
                    opacity : dataHandler.errorbarOpacityX(),
                    style : dataHandler.errorbarStyleX(),
                    data : dataHandler.errorbarDataX(),
                    width : dataHandler.errorbarWidthX()
                },
                y : {
                    enable : dataState.errorBar.y.enable,
                    color : dataHandler.errorbarColorY(),
                    opacity : dataHandler.errorbarOpacityY(),
                    style : dataHandler.errorbarStyleY(),
                    data : dataHandler.errorbarDataY(),
                    width : dataHandler.errorbarWidthY()
                },
            },
            data : {
                x : dataHandler.dataX(),
                y : dataHandler.dataY()
            },
            id : dataState.id
        }

        return {
            assetType : "linechart",
            options
        }
    }

//---------------------------------------------

    return {
        polar,
        save
    }
}

export default LineProperties;