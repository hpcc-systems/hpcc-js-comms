//  Set logging level  ---
import { Level, logger } from "../src/util/logging";
import { isTravis } from "../src/util/platform";
if (!isTravis()) {
    logger.level(Level.debug);
}

//  Load tests  ---
import "../src/index-node";
import "./index-common";
