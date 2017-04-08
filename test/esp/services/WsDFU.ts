import { expect } from "chai";

import { Service } from "../../../src/esp/services/WsDFU";
import { ESP_URL } from "../../testLib";

describe("WsDFU", function () {
    it("basic", function () {
        const service = new Service({ baseUrl: ESP_URL });
        expect(service).exist;
    });
});
