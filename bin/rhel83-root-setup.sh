#!/bin/bash

# Helpful guide:
# https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-centos-8

if [ $(id -u) != '0' ]; then
	echo "ERROR: expect to be run as root/sudo"
	exit 1
fi

echo "# Installing MariaDB Server"
dnf install -y mariadb-server

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

echo "# the commands are as if running mysql_secure_installation interactively"

mysql -u root << END_OF_SQL
-- set root password
UPDATE mysql.user
   SET Password=PASSWORD('$DB_ROOT_PASSWORD')
 WHERE User='root';
--
-- remove root remote login access
DELETE FROM mysql.user
      WHERE User='root'
        AND Host NOT IN ('localhost', '127.0.0.1', '::1');
--
-- remove anonymous users:
DELETE FROM mysql.user WHERE User='';
--
-- save the changes
FLUSH PRIVILEGES;
END_OF_SQL

echo "done"
