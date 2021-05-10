#!/bin/bash

if [ ! -f adfice_mariadb_user_password ]; then
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> adfice_mariadb_user_password
fi
MYSQL_PASSWORD=`cat adfice_mariadb_user_password | xargs`

if [ ! -f adfice_mariadb_root_password ]; then
	cat /dev/urandom \
		| tr --delete --complement 'a-zA-Z0-9' \
		| fold --width=32 \
		| head --lines=1 \
		> adfice_mariadb_root_password
fi
MYSQL_ROOT_PASSWORD=`cat adfice_mariadb_root_password | xargs`

docker stop adfice_mariadb

docker run -d \
	-p 127.0.0.1:13306:3306 \
	--name adfice_mariadb \
	--env MYSQL_DATABASE=adfice \
	--env MYSQL_USER=adfice \
	--env MYSQL_PASSWORD=$MYSQL_PASSWORD \
	--env MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
	--rm \
	mariadb:10.5

for CNT in `seq 10`; do
	echo "waiting for db $(( 10 - $CNT ))"
	sleep 1;
done

# insertSynthetic_allergies.sql \


for SQL in \
	createNewRulesTable.sql \
	createPatientTables.sql \
	insertSynthetic_labs.sql \
	newAdviceTable.sql \
	newRulesTable.sql \
	populateStaticPatientTables.sql \
	populateProblemMap.sql \
	insertSynthetic_patient.sql \
	insertSynthetic_medications.sql \
	insertSynthetic_problems.sql \
	insertSynthetic_measurements.sql \
	updateRulesWithSeparatedCriteria.sql \
	updateRulesWithSeparatedSelectors.sql
do
	docker cp $SQL adfice_mariadb:/
	docker exec adfice_mariadb mariadb \
		--host=127.0.0.1 \
		--port=3306 \
		--user=adfice \
		--password="$MYSQL_PASSWORD" \
		adfice \
		-e "source /$SQL"
done

echo 'stop the instance with:'
echo '    docker stop adfice_mariadb'
