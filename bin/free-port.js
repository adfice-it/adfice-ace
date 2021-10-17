#!/usr/bin/env node

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) E. K. Herman
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const http = require('http');
let server = http.createServer();
var listener = server.listen(0, function() {
    console.log(listener.address().port);
    listener.close();
});
