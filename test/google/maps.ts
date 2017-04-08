import { expect } from "chai";

import { GoogleMapsWebService } from "../../src/google/maps";

describe("GoogleMaps", function () {
    it("Geocode", function () {
        const gmaps = new GoogleMapsWebService();

        return gmaps.geocode("FL, 33487, USA").then((response) => {
            expect(response.status).equals("OK");
            return response;
        });
    });
});
