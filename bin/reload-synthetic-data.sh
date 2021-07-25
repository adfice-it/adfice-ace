#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

# set -x
set -e

ID=$1

if [ -e ~/adfice-user.env ]; then
	source ~/adfice-user.env
fi

if [ "_${2}_" != "__" ]; then
	echo "sourcing $2"
	source $2
else
	echo "sourcing db-scripts.env"
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
	echo "waiting for db $i"
	if node ping-db.js ; then
		echo 'db available'
		break
	else
		i=$(( $i + 1 ))
	fi
done

echo "FROM: $FILE"
echo "executing: $SQL"
$RUN_SQL "$SQL"
