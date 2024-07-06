#!/usr/bin/env node

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const http = require('http');
let server = http.createServer();
var listener = server.listen(0, function() {
    console.log(listener.address().port);
    listener.close();
});
