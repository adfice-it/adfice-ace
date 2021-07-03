#!/bin/bash
set -e

# Helpful guide:
# https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-centos-8

if [ $(id -u) != '0' ]; then
	echo "ERROR: expect to be run as root/sudo"
	exit 1
fi

echo "# Installing MariaDB Server"
dnf install -y mariadb-server

echo "# Installing NodeJS"
dnf install -y nodejs

systemctl start mariadb

echo "# ensure that MariaDB starts at boot"
systemctl enable mariadb

echo '# generating random password for MariaDB root database user'
touch /etc/mariadb_root_password
chmod -v 600 /etc/mariadb_root_password
cat /dev/urandom \
	| tr --delete --complement 'a-zA-Z0-9' \
	| fold --width=32 \
	| head --lines=1 \
	> /etc/mariadb_root_password
ls -l /etc/mariadb_root_password
DB_ROOT_PASSWORD=`cat /etc/mariadb_root_password | xargs`

echo
echo "# reading adfice user variables"
source adfice-user.env
echo "ADFICE_INSTALL_DIR=$ADFICE_INSTALL_DIR"
echo "ADFICE_USER_NAME=$ADFICE_USER_NAME"

mkdir -pv $ADFICE_INSTALL_DIR
chown -Rv $ADFICE_USER_NAME:$ADFICE_USER_NAME $ADFICE_INSTALL_DIR

echo '# generating random password for adfice database user'
touch $ADFICE_INSTALL_DIR/mariadb_user_password
cat /dev/urandom \
	| tr --delete --complement 'a-zA-Z0-9' \
	| fold --width=32 \
	| head --lines=1 \
	> $ADFICE_INSTALL_DIR/mariadb_user_password
chmod -v 600 $ADFICE_INSTALL_DIR/mariadb_user_password
DB_USER_PASSWORD=`cat $ADFICE_INSTALL_DIR/mariadb_user_password | xargs`

echo '# generating adfice.my.cnf for the db commandline client'
touch $ADFICE_INSTALL_DIR/adfice.my.cnf
chmod -v 600 $ADFICE_INSTALL_DIR/adfice.my.cnf
cat > $ADFICE_INSTALL_DIR/adfice.my.cnf << EOF
# for use with:
# mysql --defaults-file=$ADFICE_INSTALL_DIR/adfice.my.cnf
[client]
user=adfice
password=$DB_USER_PASSWORD
EOF

echo '# generating dbconfig.env for the application db connection'
touch $ADFICE_INSTALL_DIR/dbconfig.env
chmod -v 600 $ADFICE_INSTALL_DIR/dbconfig.env
cat > $ADFICE_INSTALL_DIR/dbconfig.env << EOF
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=adfice
DB_NAME=adfice
DB_PW_FILE=$ADFICE_INSTALL_DIR/mariadb_user_password
EOF

chown -vR $ADFICE_USER_NAME $ADFICE_INSTALL_DIR
ls -l $ADFICE_INSTALL_DIR

mysql -u root << END_OF_SQL
--
-- the commands are as if running mysql_secure_installation interactively
--
-- set root password
--
UPDATE mysql.user
   SET Password=PASSWORD('$DB_ROOT_PASSWORD')
 WHERE User='root';
--
-- remove root remote login access
--
DELETE FROM mysql.user
      WHERE User='root'
        AND Host NOT IN ('localhost', '127.0.0.1', '::1');
--
-- remove anonymous users:
--
DELETE FROM mysql.user WHERE User='';
--
--
-- create the adfice user
--
CREATE USER adfice IDENTIFIED BY '$DB_USER_PASSWORD';
GRANT ALL PRIVILEGES ON \`adfice\`.* TO \`adfice\`@\`%\`;
GRANT ALL PRIVILEGES ON \`adfice_portal\`.* TO \`adfice\`@\`%\`;
GRANT ALL PRIVILEGES ON \`adfice_test_%\`.* TO \`adfice\`@\`%\`;
--
-- save the changes
FLUSH PRIVILEGES;
END_OF_SQL

echo "done"
