#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
echo
echo
echo "To connect to the db as the 'root' user type:"
echo "db user 'root' password: `cat adfice_mariadb_root_password`"
echo "mariadb --host=127.0.0.1 --port=3306 -p --user=root"
echo
echo "To connect to the db as the 'adfice' user type:"
echo "db user 'adfice' password: `cat adfice_mariadb_user_password`"
echo "mariadb --host=127.0.0.1 --port=3306 -p --user=adfice adfice"
echo
docker exec -it adfice_mariadb bash
