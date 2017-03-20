import { expect } from "chai";

import { Connection, RequestType } from "../../../src/comms/connection";
import { ECLWorkunit, Service as WsWorkunits } from "../../../src/esp/services/WsWorkunits";
import { ESP_URL, isBrowser, isTravis } from "../../testLib";

describe("WsWorkunits", function () {
    describe("POST", function () {
        const wsWorkunits = new WsWorkunits(new Connection({ baseUrl: ESP_URL, type: RequestType.POST }));
        doTest(wsWorkunits);
    });
    describe("GET", function () {
        const wsWorkunits = new WsWorkunits(new Connection({ baseUrl: ESP_URL, type: RequestType.GET }));
        doTest(wsWorkunits);
    });
    if (isBrowser()) {
        describe("JSONP", function () {
            const wsWorkunits = new WsWorkunits(new Connection({ baseUrl: ESP_URL, type: RequestType.JSONP }));
            doTest(wsWorkunits);
        });
    }
});

function doTest(wsWorkunits: WsWorkunits) {
    let wu: ECLWorkunit;
    it("WUQuery", function () {
        return wsWorkunits.WUQuery().then((response) => {
            expect(response).exist;
            expect(response.Workunits).exist;
            wu = response.Workunits.ECLWorkunit[0];
            return response;
        });
    });
    it("WUInfo", function () {
        return wsWorkunits.WUInfo({ Wuid: wu.Wuid }).then((response) => {
            expect(response).exist;
            expect(response.Workunit).exist;
            return response;
        });
    });
    if (!isTravis()) {
        it("WUDetails", function () {
            return wsWorkunits.WUDetails({ WUID: wu.Wuid }).then((response) => {
                expect(response).exist;
                expect(response.WUID).to.equal(wu.Wuid);
                return response;
            });
        });
    }
}
