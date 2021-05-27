#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

echo 'establishing adfice_mariadb_user_password'
if [ -f adfice_mariadb_user_password ]; then
	echo "    adfice_mariadb_user_password file exists"
else
	echo "    creating new password from /dev/urandom"
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> adfice_mariadb_user_password
fi
MYSQL_PASSWORD=`cat adfice_mariadb_user_password | xargs`

echo 'establishing adfice_mariadb_root_password'
if [ -f adfice_mariadb_root_password ]; then
	echo "    adfice_mariadb_root_password file exists"
else
	echo "    creating new password from /dev/urandom"
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> adfice_mariadb_root_password
fi
MYSQL_ROOT_PASSWORD=`cat adfice_mariadb_root_password | xargs`

echo "check user '$USER' for group 'docker' membership"
if groups | grep -q docker; then
	echo "    user '$USER' is member of 'docker' group (ok)"
else
	echo
	echo '------------------------------------------'
	echo "user $USER not in group 'docker'"
	echo "groups are: $(groups | sed -e's/\s/\n\t/g')"
	echo 'consider:'
	echo "    sudo usermod -a -G docker $USER"
	echo '------------------------------------------'
	echo
fi

echo 'ensure db container is not already running'
docker stop adfice_mariadb

echo 'start db container'
docker run -d \
	-p 127.0.0.1:13306:3306 \
	--name adfice_mariadb \
	--env MYSQL_DATABASE=adfice \
	--env MYSQL_USER=adfice \
	--env MYSQL_PASSWORD=$MYSQL_PASSWORD \
	--env MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
	--rm \
	mariadb:10.5

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

echo 'load schema and test data'
# insertSynthetic_allergies.sql \

for SQL in \
	createNewRulesTable.sql \
	createPatientTables.sql \
	createPriority.sql \
	newAdviceTable.sql \
	newRulesTable.sql \
	newPreselectRulesTable.sql \
	populateStaticPatientTables.sql \
	populateProblemMap.sql \
	updateRulesWithSeparatedCriteria.sql \
	updateRulesWithSeparatedSelectors.sql
do
	docker cp $SQL adfice_mariadb:/
	echo "sourcing $SQL"
	docker exec adfice_mariadb mariadb \
		--host=127.0.0.1 \
		--port=3306 \
		--user=adfice \
		--password="$MYSQL_PASSWORD" \
		adfice \
		-e "source /$SQL"
done

echo 'db container is up and running'
echo 'stop the instance with:'
echo '    docker stop adfice_mariadb'
