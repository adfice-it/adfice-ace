#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

ID=$1

source db-scripts.env

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
$RUN_SQL -e "$SQL"
