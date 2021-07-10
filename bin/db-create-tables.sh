#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

set -e
# set -x

source db-scripts.env

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

echo '# load schema'
for SQL in \
	createRulesTable.sql \
	createPatientTables.sql \
	createETLTables.sql \
	newAdviceTable.sql \
	newRulesTable.sql \
	newOtherMedTable.sql \
	newPreselectRulesTable.sql \
	newNonMedHeaders.sql \
	newNonMedTable.sql \
	populateETLTables.sql \
	populateProblemMap.sql \
	updateRulesWithSeparatedSelectors.sql \
	updateMedRulesWithSQLConditions.sql \
	updatePrecheckWithSQLConditions.sql
do
	echo "# sourcing $SQL"
	$RUN_SQL "source ${DB_SQL_SCRIPTS_DIR}/$SQL"
done
