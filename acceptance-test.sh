#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

node AdficeWebserver.js &
CHILD_PID=%1
sleep 1
FILE="patient_validation?id=68"

rm -fv "$FILE"
wget 'localhost:8080/patient_validation?id=68'
WGET_EXIT_CODE=$?

kill $CHILD_PID

if [ $WGET_EXIT_CODE -ne 0 ]; then
	echo "wget failed" 2>&2
	exit $WGET_EXIT_CODE;
fi

if [ $(grep -c '63b' "$FILE") -eq 0 ]; then
	echo "'63b' not found in patient" >&2
	exit 1;
fi

rm -fv "$FILE"
