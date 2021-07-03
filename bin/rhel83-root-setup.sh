#!/bin/bash

if [ $(id -u) != '0' ]; then
	echo "ERROR: expect to be run as root/sudo"
	exit 1
fi

echo "Hello, world"
