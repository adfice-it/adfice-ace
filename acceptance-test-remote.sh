#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
echo "starting TestCafe"

if [ "_${1}_" != "__" ]; then
	ADFICE_URL="$1"
fi

if [ "_${ADFICE_URL}_" == "__" ]; then
	ADFICE_URL="https://adfice.openelectronicslab.org"
fi

set -x
./node_modules/.bin/testcafe \
	"firefox:headless" \
	acceptance-test-cafe.js \
	$ADFICE_URL
EXIT_CODE=$?

exit $EXIT_CODE
