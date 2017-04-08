import { expect } from "chai";

import { Connection, RequestType } from "../../src/comms/connection";
import { ESP_URL, isBrowser, isTravis } from "../testLib";

describe("Connection", function () {
    this.timeout(5000);
    it("Error:  no domain", function () {
        const transport = new Connection({ baseUrl: "http://1.1.1.1:8010/", timeoutSecs: 2 });
        return transport.send("no/service", {}).then(() => {
            expect.fail();
        }).catch((e) => {
            expect(e).exist;
        });
    });

    it("Error:  no service", function () {
        const transport = new Connection({ baseUrl: ESP_URL, timeoutSecs: 2 });
        return transport.send("no/service", {}).then(() => {
            expect.fail();
        }).catch((e) => {
            expect(e).exist;
        });
    });

    it("JSONP", function () {
        if (!isTravis() && isBrowser()) {
            const transport = new Connection({ baseUrl: "http://10.241.100.159:8002/WsEcl/submit/query/roxie", type: RequestType.JSONP });
            const request = {
                "bestfitmax": 1,
                "Date1": "19900613", "Address1": "1740 Maryland Ave", "City1": "Charlotte", "State1": "NC", "Zip1": "28209", "Zip1LowYYYYMM": "199002", "Zip1HighYYYYMM": "199101", "Date2": "19910829", "Address2": "1512 Turnstone Ct", "City2": "Rock Hill", "State2": "SC", "Zip2": "29732", "Zip2LowYYYYMM": "199104", "Zip2HighYYYYMM": "199204", "Date3": "19990109", "Address3": "6147 Garamond Ct", "City3": "Charlotte", "State3": "NC", "Zip3": "28270", "Zip3LowYYYYMM": "199809", "Zip3HighYYYYMM": "199908", "GeoDistanceThreshold": "5", "demomode": true
            };
            return transport.send("wecares.serialoffenderfinderservice/json", request).then((response) => {
                expect(response).exist;
            });
        }
    });
});
