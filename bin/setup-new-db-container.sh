#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021-2024 Stichting Open Electronics Lab

# set -x

echo "# Exit immediately if a command exits with a non-zero status."
set -e

if [ "_${DB_SCHEMA_NAME}_" == "__" ]; then
	if [ "_${1}_" != "__" ]; then
		echo "# sourcing $1"
		source $1
	else
		echo "# sourcing docker.db-scripts.env"
		source docker.db-scripts.env
	fi
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

ROOT_MY_CNF=root.${DB_SCHEMA_NAME}.my.cnf
if [ -f $ROOT_MY_CNF ]; then
	echo "#    $ROOT_MY_CNF file exists"
else
	echo "#    creating $ROOT_MY_CNF"
	cat > ./$ROOT_MY_CNF << EOF
# for use with:
# mysql --defaults-file=./$ROOT_MY_CNF
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

DB_CONTAINER_NAME=${DB_SCHEMA_NAME}_${DB_PORT_EXTERNAL}_mariadb

echo '# ensure db container is not already running'
docker stop ${DB_CONTAINER_NAME} || true

echo '# start db container'
docker run -d \
	-p 127.0.0.1:${DB_PORT_EXTERNAL}:3306 \
	--name ${DB_CONTAINER_NAME} \
	--env MYSQL_DATABASE=${DB_SCHEMA_NAME} \
	--env MYSQL_USER=${DB_SCHEMA_NAME} \
	--env MYSQL_PASSWORD=$DB_USER_PASSWORD \
	--env MYSQL_ROOT_PASSWORD=$DB_ROOT_PASSWORD \
	--rm \
	mariadb:10.5

echo '# copy DB config files to container'
echo "# ${DB_SCHEMA_NAME}_mariadb:$DB_DEFAULTS_FILE"
cp -v ./${DB_SCHEMA_NAME}.my.cnf ./temp.${DB_SCHEMA_NAME}.my.cnf
sed -i -e"s/port=${DB_PORT_EXTERNAL}/port=3306/" ./temp.${DB_SCHEMA_NAME}.my.cnf
docker cp ./temp.${DB_SCHEMA_NAME}.my.cnf \
	${DB_CONTAINER_NAME}:$DB_DEFAULTS_FILE
rm -v ./temp.${DB_SCHEMA_NAME}.my.cnf

echo "# ${DB_SCHEMA_NAME}_mariadb:/etc/root.my.cnf"
docker cp -L ./$ROOT_MY_CNF ${DB_CONTAINER_NAME}:/etc/root.my.cnf

echo '# copy SQL configuration scripts to container'
for SQL_FILE in sql/*sql; do
	docker cp -L $SQL_FILE ${DB_CONTAINER_NAME}:$DB_SQL_SCRIPTS_DIR
done
echo "# done copying configuration scripts"

i=0
while [ $i -lt 10 ]; do
	echo "waiting for db $i"
	if node ping-db.js 127.0.0.1 ${DB_PORT_EXTERNAL} \
		root ${DB_SCHEMA_NAME} \
		${DB_SCHEMA_NAME}_mariadb_root_password; then
		echo 'db available'
		break
	else
		i=$(( $i + 1 ))
	fi
done

echo "# Ensure DB Grants"
docker exec ${DB_CONTAINER_NAME} mariadb \
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

echo "# Show Databases"
docker exec ${DB_CONTAINER_NAME} mariadb \
	--defaults-file=/etc/root.my.cnf \
	--host=127.0.0.1 \
	--port=3306 \
	mysql \
	-e "SHOW DATABASES;"

echo "# Show ALL DB Grants"
docker exec ${DB_CONTAINER_NAME} mariadb \
	--defaults-file=/etc/root.my.cnf \
	--host=127.0.0.1 \
	--port=3306 \
	${DB_SCHEMA_NAME} \
	-e "SHOW GRANTS;"

echo "# Show USER DB Grants"
docker exec ${DB_CONTAINER_NAME} mariadb \
	--defaults-file=/etc/${DB_SCHEMA_NAME}.my.cnf \
	--host=127.0.0.1 \
	--port=3306 \
	${DB_SCHEMA_NAME} \
	-e "SHOW GRANTS;"

echo '# db container is up and running'
echo '# stop the instance with:'
echo "    docker stop ${DB_CONTAINER_NAME}"
