#!/usr/bin/env node

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) E. K. Herman
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var express = require('express');

var app = new express();
var listener = app.listen(0, function() {
    console.log(listener.address().port);
    listener.close();
});
