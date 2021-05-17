#!/bin/bash

node AdficeWebserver.js &
CHILD_PID=%1
sleep 1

rm -fv index.html
wget localhost:8080

kill $CHILD_PID

if [ $(grep -c 'angststoornis' index.html ) -eq 0 ]; then
	echo "'angststoornis' not found in index.html" >&2
	exit 1;
fi

rm -fv index.html
