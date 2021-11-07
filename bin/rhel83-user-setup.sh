#!/bin/bash
set -x
set -e

if [ "_${DBUS_SESSION_BUS_ADDRESS}_" == "__" ]; then
	if [ "_${UID}_" == "__" ]; then
		UID=`id | cut -d'=' -f2 | cut -d'(' -f1 | xargs`
	fi
	export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus
fi

source adfice-user.env
echo "ADFICE_INSTALL_DIR=$ADFICE_INSTALL_DIR"
echo "ADFICE_TAR_FILE=$ADFICE_TAR_FILE"

echo "# create the 'adfice' database schema"
mysql --defaults-file=$ADFICE_INSTALL_DIR/adfice.my.cnf \
  --execute="CREATE DATABASE adfice;"
echo
echo "# create the 'valportaal' database schema"
mysql --defaults-file=$ADFICE_INSTALL_DIR/adfice.my.cnf \
  --execute="CREATE DATABASE valportaal;"

echo
echo "# install application files"
cp -Rv adfice-*/* $ADFICE_INSTALL_DIR
cd $ADFICE_INSTALL_DIR

echo
echo "# installing module dependencies"
npm install

echo "# is the DB up?"
node ping-db.js && echo "#    yes, DB is up"

echo "# initializing database tables"
ln -sv system.db-scripts.env db-scripts.env
source bin/db-create-tables.sh
echo
echo "# load synthetic data"
source bin/load-synthetic-data.sh

echo
echo "# create a user service for adfice"
mkdir -pv ~/.config/systemd/user/
tee ~/.config/systemd/user/adfice.service << END_OF_FILE
[Unit]
Description=Adfice web service

[Service]
ExecStart=/usr/bin/node adfice-webserver-runner.js $ADFICE_HTTP_PORT
WorkingDirectory=$ADFICE_INSTALL_DIR
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
END_OF_FILE

cat ~/.config/systemd/user/adfice.service

echo
echo "attempt to create a user daemon"
set +e
systemctl --user daemon-reload
systemctl --user enable adfice.service
systemctl --user start adfice.service
set -e

echo "# done rhel83-user-setup.sh"
