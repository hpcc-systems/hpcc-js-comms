// Promise polyfill  ---
import "es6-promise";

//  XHR polyfill  ---
import { request as d3Request } from "d3-request";
import { initD3Request } from "./comms/connection";
initD3Request(d3Request);

//  Alternative XHR polyfill   ---
//  import * as xhr from "xhr";
//  initNodeRequest(xhr.default);

export * from "./index-common";
