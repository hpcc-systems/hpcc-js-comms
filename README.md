[![Build Status](https://travis-ci.org/hpcc-systems/hpcc-js-comms.svg?branch=master)](https://travis-ci.org/hpcc-systems/hpcc-js-comms)
[![Join the chat at https://gitter.im/hpcc-systems/hpcc-js-comms](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hpcc-systems/hpcc-js-comms?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# hpcc-js-comms
This module provides a convenient interface for interacting with the HPCC-Platform ESP API from a NodeJS or web browser.

## Quick Examples ([...more](https://github.com/hpcc-systems/hpcc-js-comms/blob/master/test/esp/ecl/Workunit.ts))
_...For the impatiant_

###  Submitting ECL:
* Submit ECL
* Wait for completion
* Fetch results

```js
import { Workunit } from "hpcc-js-comms";

return Workunit.submit({baseUrl: "http://x.x.x.x:8010", usedID: "", password: ""}, "hthor", "'Hello and Welcome!';").then((wu) => {
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
```

###  Fetch a list of Workunits

```js
import { Workunit } from "hpcc-js-comms";

return Workunit.query({ baseUrl: "http://x.x.x.x:8010", userID: "", password: "" }, { State: "completed", LastNDays: 7, Count: 3 }).then((wus) => {
    wus.forEach((wu) => {
        console.log(`${wu.Wuid} Total Cluster Time:  ${wu.TotalClusterTime}`);
    });
});
```

### Resubmit workunit
```js
import { Workunit } from "hpcc-js-comms";

const wu = Workunit.attach({ baseUrl: "http://x.x.x.x:8010", userID: "userID", password: "pw" }, "W20170401-082211");
wu.resubmit()
    .then((wu) => {
        //  Success  ---
    }).catch((e){
        //  Failure  ---
        console.log(JSON.stringify(e));
    });
```

## Installing

If you use NPM, `npm install @hpcc-js/comms`. Otherwise, download the [latest release](https://github.com/hpcc-systems/hpcc-js-comms/releases/latest).  AMD, CommonJS, and vanilla JS environments are supported. (In vanilla, a `HPCCComms` global is exported):

```html
<script src="https://hpccsystems.com/hpcc-js/comms-browser.min.js"></script>
<script>
return HPCCComms.query({ baseUrl: ESP_URL, userID: "", password: "" }, {}).then((wus) => {
    wus.forEach((wu) => {
        console.log(wu.TotalClusterTime);
    });
});
</script>
```

[Try hpcc-js-comms in your browser.](https://tonicdev.com/npm/@hpcc-js/comms)

## API Reference

TODO