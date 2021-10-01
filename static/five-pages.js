// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :

// starting WITHOUT "use strict" in order to try to use the same .js file
// from .html and also from .ejs which defines the variables patient_id and
// patient_data
if (typeof patient_id == 'undefined') {
    patient_id = null;
}

if (typeof patient_data == 'undefined') {
    patient_data = {};
}

"use strict";
var xhttp;

if (navigator.userAgent.includes("Node.js") ||
    navigator.userAgent.includes("jsdom")) {} else {
    window.addEventListener('load', startPageLoad);
}

function havePatientJSON() {
    if (this.readyState == 4 && this.status == 200) {
        patient_data = JSON.parse(xhttp.responseText);
    }
}

function startPageLoad() {
    let params = new URLSearchParams(window.location.search)
    patient_id = params.get('id');

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = havePatientJSON;
    xhttp.open("GET", "advice?id=" + patient_id, true);
    xhttp.send();
}

// export modules for unit testing ?

function getPatientData() {
    return patient_data;
}

if (typeof module !== 'undefined') {
    module.exports = {
        startPageLoad: startPageLoad,
        getPatientData: getPatientData,
    }
}
