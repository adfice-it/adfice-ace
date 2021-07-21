#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

echo "# Exit immediately if a command exits with a non-zero status."
set -e


if [ "_${DB_SCHEMA_NAME}_" == "__" ]; then
	source docker.db-scripts.env
fi
if [ "_${DB_SCHEMA_NAME}_" == "__" ]; then
	echo "must set DB_SCHEMA_NAME, check docker.db-scripts.env"
	exit 1
fi
if [ "_${DB_PORT_EXTERNAL}_" == "__" ]; then
	echo "must set DB_PORT_EXTERNAL, check docker.db-scripts.env"
	exit 1
fi

echo "# establishing ${DB_SCHEMA_NAME}_mariadb_user_password"
if [ -f ${DB_SCHEMA_NAME}_mariadb_user_password ]; then
	echo "#    ${DB_SCHEMA_NAME}_mariadb_user_password file exists"
else
	echo "#    creating new password from /dev/urandom"
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> ${DB_SCHEMA_NAME}_mariadb_user_password
fi
DB_USER_PASSWORD=`cat ${DB_SCHEMA_NAME}_mariadb_user_password | xargs`

if [ -f ${DB_SCHEMA_NAME}.my.cnf ]; then
	echo "#    ${DB_SCHEMA_NAME}.my.cnf file exists"
else
	echo "#    creating ${DB_SCHEMA_NAME}.my.cnf"
	cat > ${DB_SCHEMA_NAME}.my.cnf << EOF
# for use with:
# mysql --defaults-file=./${DB_SCHEMA_NAME}.my.cnf
[client-server]
host=127.0.0.1
port=${DB_PORT_EXTERNAL}

[client]
user=$DB_SCHEMA_NAME
password=$DB_USER_PASSWORD
EOF
fi

echo "# establishing ${DB_SCHEMA_NAME}_mariadb_root_password"
if [ -f ${DB_SCHEMA_NAME}_mariadb_root_password ]; then
	echo "#    ${DB_SCHEMA_NAME}_mariadb_root_password file exists"
else
	echo "#    creating new password from /dev/urandom"
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> ${DB_SCHEMA_NAME}_mariadb_root_password
fi
DB_ROOT_PASSWORD=`cat ${DB_SCHEMA_NAME}_mariadb_root_password | xargs`

if [ -f root.my.cnf ]; then
	echo "#    root.my.cnf file exists"
else
	echo "#    creating root.my.cnf"
	cat > root.my.cnf << EOF
# for use with:
# mysql --defaults-file=./root.my.cnf
[client]
user=root
password=$DB_ROOT_PASSWORD
EOF
fi

echo "# check user '$USER' for group 'docker' membership"
if groups | grep -q docker; then
	echo "#    user '$USER' is member of 'docker' group (ok)"
else
	echo
	echo '# ------------------------------------------'
	echo "# user $USER not in group 'docker'"
	echo "# groups are: $(groups | sed -e's/\s/\n\t/g')"
	echo '# consider:'
	echo "    sudo usermod -a -G docker $USER"
	echo '# ------------------------------------------'
	echo
fi

echo '# ensure db container is not already running'
docker stop ${DB_SCHEMA_NAME}_mariadb || true

echo '# start db container'
docker run -d \
	-p 127.0.0.1:${DB_PORT_EXTERNAL}:3306 \
	--name ${DB_SCHEMA_NAME}_mariadb \
	--env MYSQL_DATABASE=${DB_SCHEMA_NAME} \
	--env MYSQL_USER=${DB_SCHEMA_NAME} \
	--env MYSQL_PASSWORD=$DB_USER_PASSWORD \
	--env MYSQL_ROOT_PASSWORD=$DB_ROOT_PASSWORD \
	--rm \
	mariadb:10.5

echo '# copy DB config files to container'
cp -v ./${DB_SCHEMA_NAME}.my.cnf ./temp.${DB_SCHEMA_NAME}.my.cnf
sed -i -e"s/port=${DB_PORT_EXTERNAL}/port=3306/" ./temp.${DB_SCHEMA_NAME}.my.cnf
docker cp ./temp.${DB_SCHEMA_NAME}.my.cnf \
	${DB_SCHEMA_NAME}_mariadb:$DB_DEFAULTS_FILE
rm -v ./temp.${DB_SCHEMA_NAME}.my.cnf
docker cp root.my.cnf ${DB_SCHEMA_NAME}_mariadb:/etc/
echo '# copy SQL configuration scripts to container'
for SQL_FILE in sql/*sql; do
	docker cp $SQL_FILE ${DB_SCHEMA_NAME}_mariadb:$DB_SQL_SCRIPTS_DIR
done
echo "# done copying configuration scripts"

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

echo "# Ensure DB Grants"
docker exec ${DB_SCHEMA_NAME}_mariadb mariadb \
	--defaults-file=/etc/root.my.cnf \
	--host=127.0.0.1 \
	--port=3306 \
	mysql \
	-e "/* ensure ${DB_SCHEMA_NAME} db user grants */
GRANT ALL PRIVILEGES
   ON \`${DB_SCHEMA_NAME}\`.*
   TO \`${DB_SCHEMA_NAME}\`@\`%\`
;
GRANT ALL PRIVILEGES
   ON \`${DB_SCHEMA_NAME}_%\`.*
   TO \`${DB_SCHEMA_NAME}\`@\`%\`
;
/* save the changes */
FLUSH PRIVILEGES;
"

echo "# Show DB Grants"
docker exec ${DB_SCHEMA_NAME}_mariadb mariadb \
	--defaults-file=/etc/${DB_SCHEMA_NAME}.my.cnf \
	--host=127.0.0.1 \
	--port=3306 \
	${DB_SCHEMA_NAME} \
	-e "SHOW GRANTS;"

echo '# db container is up and running'
echo '# stop the instance with:'
echo "    docker stop ${DB_SCHEMA_NAME}_mariadb"
