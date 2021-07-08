#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

ID=$1

SQL=insertSynthetic_patient_data_$1.sql
FILE=sql/$SQL
if [ ! -e $FILE ]; then
	echo "no file $FILE"
	exit 1
fi

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

cat adfice.my.cnf
echo "sourcing $SQL"
mysql --defaults-file=adfice.my.cnf adfice < $FILE
