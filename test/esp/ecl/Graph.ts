import { expect } from "chai";

import { Graph } from "../../../src/esp/ecl/Graph";

describe("Graph", function () {
    it("basic", function () {
        expect(Graph).to.be.a("function");
    });
});
