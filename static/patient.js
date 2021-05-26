// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
var fs = require('fs');

console.log("hello world!");
var ws;

function ws_on_message(event) {
    const data = JSON.parse(event.data);
    console.log(data);
    elementList = document.querySelectorAll("input[type='checkbox']");
    elementList.forEach((checkbox) => {
        checkbox.style.visibility = "visible";
    })
}

window.addEventListener('load', (event) => {
    /* init_chart(); */
    /*
        var serverDataElem = document.getElementById("serverData");
        var previous = serverDataElem.innerHTML;
        serverDataElem.innerHTML = `ws://${hostname}:${port}/sub<br>${ws}`;
    */
    var url = new URL(document.URL);
    var hostname = url.hostname;
    var port = url.port;
    ws = new WebSocket(`ws://${hostname}:${port}/sub`);
    ws.onmessage = ws_on_message;
});
