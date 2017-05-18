import { expect } from "chai";

import { Service } from "../../../src/esp/services/wsTopology";
import { ESP_URL } from "../../testLib";

describe("WsTopology", function () {
    it("basic", function () {
        const service = new Service({ baseUrl: ESP_URL });
        expect(service).exist;
    });
});
