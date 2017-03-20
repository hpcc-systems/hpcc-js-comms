import { expect } from "chai";

import { SourceFile } from "../../../src/esp/ecl/SourceFile";

describe("SourceFile", function () {
    it("basic", function () {
        expect(SourceFile).to.be.a("function");
    });
});
