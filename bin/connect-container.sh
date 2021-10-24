#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

if [ "_${DB_SCHEMA_NAME}_" == "__" ]; then
	if [ "_${1}_" != "__" ]; then
		echo "sourcing $1"
		source $1
	else
		echo "sourcing docker.db-scripts.env"
		source docker.db-scripts.env
	fi
fi

cat <<END_OF_MSG

To connect to the db as the 'root' user type:
mariadb --defaults-file=/etc/root.my.cnf --host=127.0.0.1 --port=3306

To connect to the db as the '$DB_SCHEMA_NAME' user type:
mariadb --defaults-file=$DB_DEFAULTS_FILE $DB_SCHEMA_NAME

END_OF_MSG
DB_CONTAINER_NAME=${DB_SCHEMA_NAME}_${DB_PORT_EXTERNAL}_mariadb
docker exec -it ${DB_CONTAINER_NAME} bash
