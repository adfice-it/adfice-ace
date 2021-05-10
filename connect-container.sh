#!/bin/bash
echo
echo "db user 'adfice' password: `cat adfice_mariadb_user_password`"
echo "db user 'root' password: `cat adfice_mariadb_root_password`"
echo
echo "To connect to the db, type:"
echo "mariadb --host=127.0.0.1 --port=3306 -p --user={adfice or root}"
echo
docker exec -it adfice_mariadb bash
