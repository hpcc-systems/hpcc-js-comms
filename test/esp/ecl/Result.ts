import { expect } from "chai";

import { Result } from "../../../src/esp/ecl/Result";

describe("Result", function () {
    it("basic", function () {
        expect(Result).to.be.a("function");
    });
});
