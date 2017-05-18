import { expect } from "chai";

import { Service } from "../../../src/esp/services/wsDFU";
import { ESP_URL } from "../../testLib";

describe("WsDFU", function () {
    it("basic", function () {
        const service = new Service({ baseUrl: ESP_URL });
        expect(service).exist;
        return service.DFUQuery({}).then(response => {
            expect(response).to.exist;
            expect(response.DFULogicalFiles.DFULogicalFile.length).to.be.greaterThan(-1);
            return response;
        });
    });
});
