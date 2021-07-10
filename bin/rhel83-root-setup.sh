#!/bin/bash
set -e

# Helpful guide:
# https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-centos-8

if [ $(id -u) != '0' ]; then
	echo "ERROR: expect to be run as root/sudo"
	exit 1
fi

echo "# We need MariaDB version >= 10.5 to support SQL Condition queries,"
echo "# the repositories seem to only have version 10.3"
echo "# thus, add the official MariaDB repository"
# Note: for Red Hat Enterprise Linux 8, replace
#     baseurl = http://yum.mariadb.org/10.5/centos8-amd64
# with
#     baseurl = http://yum.mariadb.org/10.5/rhel8-amd64
# 'tee' also echos to the screen
tee /etc/yum.repos.d/mariadb.repo << END_OF_FILE
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.5/centos8-amd64
module_hotfixes=1
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
END_OF_FILE
yum makecache

echo "# Installing MariaDB Server (10.5)"
dnf install -y mariadb-server

echo "# Installing NodeJS (system version, currently 10.24.0, tested with v12)"
dnf install -y nodejs

systemctl start mariadb

echo "# ensure that MariaDB starts at boot"
systemctl enable mariadb

echo '# generating random password for MariaDB root database user'
touch /etc/mariadb_root_password
# that only root can read
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
echo "ADFICE_HTTP_PORT=$ADFICE_HTTP_PORT"

echo
echo "# allow the adfice user launch the Adfice service"
loginctl enable-linger $ADFICE_USER_NAME

echo
echo "# allow machines on the local network to connect to the adfice service"
firewall-cmd --zone=public --add-port=$ADFICE_HTTP_PORT/tcp --permanent
# above firewall-cmd will likely change to 443 if we add NginX

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
-- these commands automate the steps from mysql_secure_installation
-- (the script mysql_secure_installation requires human interaction)
--
-- set root password
--
UPDATE mysql.global_priv
    SET priv=json_set(priv,
        '$.plugin', 'mysql_native_password',
        '$.authentication_string', PASSWORD('$esc_pass'))
      WHERE User='root';
-- Pre MariaDB 10.4 syntax
--    UPDATE mysql.user
--        SET Password=PASSWORD('$DB_ROOT_PASSWORD')
--      WHERE User='root';
--
-- remove root remote login access
--
DELETE FROM mysql.global_priv
      WHERE User='root'
        AND Host NOT IN ('localhost', '127.0.0.1', '::1');
-- Pre MariaDB 10.4 syntax
-- DELETE FROM mysql.user
--      WHERE User='root'
--        AND Host NOT IN ('localhost', '127.0.0.1', '::1');
--
-- remove anonymous users:
--
DELETE FROM mysql.global_priv WHERE User='';
-- Pre MariaDB 10.4 syntax
-- DELETE FROM mysql.user WHERE User='';
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