export const version = "0.0.1";

//  Comms transport - Should be its own package?
import * as connecton from "./comms/connection";
export const Connecton = connecton;

//  Raw Services  ---
export { Service as WsWorkunits, WUAction } from "./esp/services/WsWorkunits";
export { Service as WsTopology } from "./esp/services/WsTopology";
export { Service as WsSMC } from "./esp/services/WsSMC";
export { Service as WsDFU } from "./esp/services/WsDFU";

//  OO Wrappers  ---
export { Workunit } from "./esp/ecl/Workunit";
export { Result } from "./esp/ecl/Result";
export { SourceFile } from "./esp/ecl/SourceFile";
export { Resource } from "./esp/ecl/Resource";
export { Timer } from "./esp/ecl/Timer";
export { XGMMLGraph, GraphItem } from "./esp/ecl/Graph";

//  Utils  - Should be its own package?
export { IObserverHandle } from "./util/observer";
export { espTime2Seconds } from "./util/esp";
