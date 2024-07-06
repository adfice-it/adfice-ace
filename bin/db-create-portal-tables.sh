#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021-2024 Stichting Open Electronics Lab

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

if [ ${DB_BACKUP_DIR} ]; then
	DB_BACKUP_FILE="${DB_BACKUP_DIR}/backup-portal-`date '+%Y%m%d_%H%M%S'`.sql"
	echo "backup to $DB_BACKUP_FILE"
	$DB_DUMP_CMD > $DB_BACKUP_FILE || echo "unable to backup"
	ls -l $DB_BACKUP_FILE || echo "no $DB_BACKUP_FILE"
fi

echo '# load schema'
for SQL in \
	createPortalTables.sql
do
	echo "# sourcing $SQL"
	$RUN_SQL "source ${DB_SQL_SCRIPTS_DIR}/$SQL"
done
