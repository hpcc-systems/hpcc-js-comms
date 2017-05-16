function doTest() {
    const transport = new HPCCComms.Connection({
        baseUrl: "http://10.240.32.125:8010/",
        userID: "gosmith",
        password: "ch@ng3m3",
        type: HPCCComms.RequestType.JSONP
    });
    return transport.send("WsWorkunits/WUQuery.json", {}).then((response) => {
        console.log(JSON.stringify(response));
    }).catch((e) => {
        console.log(e);
    });
}