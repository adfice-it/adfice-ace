#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
echo
echo
echo "Commandline options (including passwords) are visible"
echo " in the process list, thus it is better to be prompted"
echo " than to make it part of the command."
echo
echo "To connect to the db as the 'root' user type:"
echo "mariadb --host=127.0.0.1 --port=3306 --user=root --password\\"
echo "=`cat adfice_mariadb_root_password`"
echo
echo "To connect to the db as the 'adfice' user type:"
echo "mariadb --host=127.0.0.1 --port=3306 --user=adfice adfice --password\\"
echo "=`cat adfice_mariadb_user_password`"
echo
docker exec -it adfice_mariadb bash
