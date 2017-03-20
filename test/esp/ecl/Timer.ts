import { expect } from "chai";

import { Timer } from "../../../src/esp/ecl/Timer";

describe("Timer", function () {
    it("basic", function () {
        expect(Timer).to.be.a("function");
    });
});
