import { RecursivePartial } from "../../Graph2D/Graph2D_Types";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart_Types";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"}
};

function LineChart(options : RecursivePartial<Line_Chart_Options> = {}) : Line_Chart{
    const dataState : Line_Chart_State = {
        useAxis : {...defaultOptions.useAxis, ...options.useAxis}
    };  

    const dataHandler : RecursivePartial<Line_Chart> = {};

    return dataHandler as Line_Chart
}