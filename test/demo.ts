// tslint:disable:no-console
import { Workunit } from "../src/esp/ecl/Workunit";

describe.skip("Readme quick start", function () {
    it("Quick Submit", function () {
        return Workunit.submit({ baseUrl: "http://192.168.3.22:8010", userID: "userID", password: "pw" }, "hthor", "'Hello and Welcome!';").then((wu) => {
            return wu.watchUntilComplete();
        }).then((wu) => {
            return wu.fetchResults().then((results) => {
                return results[0].fetchRows();
            }).then((rows) => {
                console.log(JSON.stringify(rows));
                return wu;
            });
        }).then((wu) => {
            return wu.delete();
        }).catch((e) => {
            //  Recover
        });
    });

    it("Quick Submit", function () {
        return Workunit.submit({ baseUrl: "http://192.168.3.22:8010", userID: "userID", password: "pw" }, "hthor", "'Hello and Welcome!';").then((wu) => {
            return wu.watchUntilComplete();
        }).then((wu) => {
            return wu.fetchResults().then((results) => {
                return results[0].fetchRows();
            }).then((rows) => {
                console.log(JSON.stringify(rows));
                return wu;
            });
        }).then((wu) => {
            return wu.delete();
        });
    });

    it("query", function () {
        return Workunit.query({ baseUrl: "http://192.168.3.22:8010", userID: "userID", password: "pw" },
            { State: "completed", LastNDays: 7, Count: 99 }).then((wus) => {
                wus.forEach((wu) => {
                    console.log(`${wu.Wuid} Total Cluster Time:  ${wu.TotalClusterTime}`);
                });
            });
    });

    it("resubmit", function () {
        const eclWorkunit = Workunit.attach({ baseUrl: "http://192.168.3.22:8010", userID: "userID", password: "pw" }, "W20170404-085158xxx");
        return eclWorkunit.resubmit()
            .then((wu) => {
                return wu.watchUntilComplete()
                    .then(() => {
                        return wu.fetchResults().then((results) => {
                            return results[0].fetchRows();
                        }).then((rows) => {
                            console.log(JSON.stringify(rows));
                        });
                    });
            }).catch((e) => {
                console.log(JSON.stringify(e));
            });
    });
});
