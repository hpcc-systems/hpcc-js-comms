// DOM Parser polyfill  ---
import { DOMParser } from "xmldom";
import { root } from "./util/runtime";
root.DOMParser = DOMParser;

//  XHR polyfill  ---
import * as nodeRequest from "request";
import { initNodeRequest } from "./comms/connection";
initNodeRequest(nodeRequest);

//  Alternative XHR polyfill   ---
//  import { request as d3Request } from "d3-request";
//  initD3Request(d3Request);

export * from "./index-common";
