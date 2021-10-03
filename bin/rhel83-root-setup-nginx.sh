#!/bin/bash
set -x
set -e

if [ $(id -u) != '0' ]; then
	echo "ERROR: expect to be run as root/sudo"
	exit 1
fi

# echo "# Installing NginX"
dnf install -y nginx

echo
echo "# reading adfice user variables"
source adfice-user.env
echo "ADFICE_INSTALL_DIR=$ADFICE_INSTALL_DIR"
echo "ADFICE_USER_NAME=$ADFICE_USER_NAME"
echo "ADFICE_HTTP_PORT=$ADFICE_HTTP_PORT"

echo "creating temporary SSL Self-Signed Certificate"
mkdir -pv /etc/pki/nginx/private
OPENSSL_TMP_SUBJ="/C=NL/ST=Utrecht/L=Utrecht/O=ExampleOrg/OU=Dev"
openssl req -newkey rsa:4096 -x509 -nodes -days 3560 \
 -subj "$OPENSSL_TMP_SUBJ" \
 -keyout /etc/pki/nginx/private/server.key \
    -out /etc/pki/nginx/server.crt

cp -v /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
cp -v /home/$ADFICE_USER_NAME/adfice-*/example.nginx.conf /etc/nginx/nginx.conf

echo
echo "# firewall may not be running, allow firewall commands to error"
set +e
echo
echo "# allow connection to the adfice service over https"
firewall-cmd --zone=public --add-service=https --permanent
echo "# allow http to https redirect"
firewall-cmd --zone=public --add-service=http --permanent

echo "# close the non-https ADFICE PORT"
firewall-cmd --zone=public --remove-port=$ADFICE_HTTP_PORT/tcp --permanent
echo "# done with firewall-cmd, return to exit on failure mode"
set -e

echo "# allow nginx to proxy"
setsebool -P httpd_can_network_relay 1
setsebool -P httpd_can_network_connect 1

systemctl start nginx

echo "# ensure that NginX starts at boot"
systemctl enable nginx

echo "# done rhel83-root-setup-nginx.sh"
