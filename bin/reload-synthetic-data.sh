#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

# set -x
set -e

ID=$1

if [ "_${VERBOSE}_" == "__" ]; then
VERBOSE=0
fi

if [ -e ~/adfice-user.env ]; then
	source ~/adfice-user.env
fi

if [ "_${2}_" != "__" ]; then
	if [ $VERBOSE -gt 0 ]; then
		echo "sourcing $2"
	fi
	source $2
else
	if [ $VERBOSE -gt 0 ]; then
		echo "sourcing db-scripts.env"
	fi
	source db-scripts.env
fi

SQL_FILE=insertSynthetic_patient_data_$1.sql
FILE=sql/$SQL_FILE
if [ ! -e $FILE ]; then
	echo "no file $FILE"
	exit 1
fi
SQL=`cat $FILE`

i=0
while [ $i -lt 10 ]; do
	if [ $VERBOSE -gt 0 ]; then
		echo "waiting for db $i"
	fi
	if node ping-db.js ; then
		if [ $VERBOSE -gt 0 ]; then
			echo 'db available'
		fi
		break
	else
		i=$(( $i + 1 ))
	fi
done

if [ $VERBOSE -gt 0 ]; then
	echo "FROM: $FILE"
	echo "executing: $SQL"
fi
$RUN_SQL "$SQL"
