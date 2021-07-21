#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

if [ "_${DB_SCHEMA_NAME}_" == "__" ]; then
	source docker.db-scripts.env
fi

cat <<END_OF_MSG

To connect to the db as the 'root' user type:
mariadb --defaults-file=/etc/root.my.cnf --host=127.0.0.1 --port=3306

To connect to the db as the '$DB_SCHEMA_NAME' user type:
mariadb --defaults-file=$DB_DEFAULTS_FILE $DB_SCHEMA_NAME

END_OF_MSG
docker exec -it ${DB_SCHEMA_NAME}_mariadb bash
