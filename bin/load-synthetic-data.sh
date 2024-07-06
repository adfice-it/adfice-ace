#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021-2024 Stichting Open Electronics Lab

set -e
# set -x

if [ "_${1}_" != "__" ]; then
	echo "sourcing $1"
	source $1
else
	echo "sourcing db-scripts.env"
	source db-scripts.env
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

echo '# load test data'
for SQL in \
	insertSynthetic_labs.sql \
	insertSynthetic_patient.sql \
	insertSynthetic_medications.sql \
	insertSynthetic_problems.sql \
	insertSynthetic_measurements.sql
do
	echo "# sourcing $SQL"
	$RUN_SQL "source ${DB_SQL_SCRIPTS_DIR}/$SQL"
done
