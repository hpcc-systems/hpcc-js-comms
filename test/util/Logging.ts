import { expect } from "chai";

import { logger } from "../../src/util/Logging";

describe("Logging", function () {
    it("unitTest", function () {
        expect(logger).exist;
    });
});
