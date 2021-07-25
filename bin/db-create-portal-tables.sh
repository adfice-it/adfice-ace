#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

set -e
# set -x

if [ "_${1}_" != "__" ]; then
	echo "# sourcing $1"
	source $1
else
	echo "# sourcing portal-db-scripts.env"
	source portal-db-scripts.env
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

echo '# load schema'
for SQL in \
	createPortalTables.sql
do
	echo "# sourcing $SQL"
	$RUN_SQL "source ${DB_SQL_SCRIPTS_DIR}/$SQL"
done
