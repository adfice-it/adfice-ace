#!/bin/bash
set -e

source adfice-user.env
echo "ADFICE_INSTALL_DIR=$ADFICE_INSTALL_DIR"
echo "ADFICE_TAR_FILE=$ADFICE_TAR_FILE"

mysql --defaults-file=$ADFICE_INSTALL_DIR/adfice.my.cnf \
  --execute="CREATE DATABASE adfice;"

cp -Rv adfice-*/* $ADFICE_INSTALL_DIR
cd $ADFICE_INSTALL_DIR

echo "# installing module dependencies"
npm install

node ping-db.js && echo "DB is up"

echo "# initializing database tables"
ln -sv system.db-create-tables.env db-create-tables.env
source bin/db-create-tables.sh
source bin/load-synthetic-data.sh

echo "# create a user service for adfice"
mkdir -pv ~/.config/systemd/user/
tee ~/.config/systemd/user/adfice.service << END_OF_FILE
[Unit]
Description=Adfice web service

[Service]
ExecStart=/usr/bin/node AdficeWebserver.js $ADFICE_HTTP_PORT
WorkingDirectory=$ADFICE_INSTALL_DIR
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
END_OF_FILE
systemctl --user daemon-reload
systemctl --user enable adfice.service
systemctl --user start adfice.service
