import { expect } from "chai";

import { ESPConnection } from "../../../src/esp/comms/connection";

describe("ESPConnection", function () {
    it("basic", function () {
        expect(ESPConnection).to.be.a("function");
    });
});
