# SciGrapher.js

![license](https://img.shields.io/badge/license-MIT-green?style=plastic) ![version](https://img.shields.io/github/package-json/v/JhoselinRam/scigrapher?filename=dist%2Fpackage.json&style=plastic) ![npm](https://img.shields.io/npm/v/scigrapher?style=plastic) ![types](https://img.shields.io/npm/types/scigrapher?style=plastic) ![dependencies](https://img.shields.io/badge/dependencies-none-blue?style=plastic)

SciGrapher.js is a JavaScript/TypeScript library capable of producing high quality scientific oriented graphs on the browser with minimum configuration. It's based on the HTML canvas element to ensure high responsively and avoid overload the DOM with potentially hundreds of elements.

#### What do I mean with "scientific oriented"?

SciGrapher.js, unlike other tools like Chart.js or D3.js, is not a general purpose charting library, its goal is to accurately represent numeric data generated by mathematical equations or other (physical) sources. The resulting graphs are closer to those generated by MATLAB or Matplotlib, rather than an illustrative panel, for example.

At the moment, the library offers four chart types, including:

- Line chart, this can be used to generate dispersion graphs as well.
- Area, used to represent the area between two curves.
- Heatmap, to represent scalar fields.
- Vector field, to represent two-dimensional vector fields.
    
## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Graph Methods](#graph-methods)
* [Background](#background)
  * [Axis](#axis)
  * [Grid](#grid)
  * [Labels](#labels)
  * [Events](#events)
  * [Graph Properties](#graph-properties)
* [Datasets](#datasets)
  * [Line Chart](#linechart)
    * [Line Data](#line-data)
    * [Marker](#marker)
    * [Error bars](#error-bars)
    * [Line Properties](#line-properties)   
  * [Area](#area)
    * [Area Data](#area-data)
    * [Area Properties](#area-properties) 
  * [Heatmap](#heatmap)
    * [Heatmap Data](#heatmap-data)
    * [heatmap Properties](#heatmap-properties) 
  * [Vector Field](#vector-field)
    * [Vector Field Data](#vector-field-data)
    * [Vector Field Properties](#vector-field-properties) 
 * [Colorbar](#colorbar)
 * [Legend](#legend)
 * [Extras](#extras)
 * [License](#license)

## Installation

## Usage

Each graph is controlled by a single object created by calling the `graph2D` function.

    graph2D(element)
    graph2D(element, options)

Where
* `element` is a div element
* `options` is an object containing the [options](#graph-options) to change the default behavior and appearance of the graph.

> Note: The options object has a lot of properties and complex structure, its use is intended for copying or generate graphs from another graphs. All its properties are breake down in the `graph2D` methods, is best to use those instead.

To start, call the `graph2D` function and assign the object generated to a variable, use its methods to change the appearance and behavior to your needs and finally call the `draw` method to render the final result.
The methods can be chained.

HTML:

    <body>
       <div id="my-graph"></div>
    </body>

JS:

    const element = document.querrySelector("#my-graph");
    const graph = graph2D(element).axisPoition("center").draw();

Result:

![default_graph](/assets/images/default_graph.png)