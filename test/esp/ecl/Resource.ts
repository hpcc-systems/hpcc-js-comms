import { expect } from "chai";

import { Resource } from "../../../src/esp/ecl/Resource";

describe("Resource", function () {
    it("basic", function () {
        expect(Resource).to.be.a("function");
    });
});
