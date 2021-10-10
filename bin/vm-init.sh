#!/bin/bash
set -x
set -e
source /root/adfice-user.env
adduser -U $ADFICE_USER_NAME
cp -rv /root/.ssh /home/$ADFICE_USER_NAME
mv -v /root/adfice-user.env /home/$ADFICE_USER_NAME
mv -v /root/adfice-ace.tar.gz /home/$ADFICE_USER_NAME
cd /home/$ADFICE_USER_NAME
tar xvf adfice-ace.tar.gz
echo 'work-around the broken symbolic links'
pushd adfice-*/static/thirdparty
mv -v showdown.min.js showdown.min.js.orig
ln -sv ../../node_modules/showdown/dist/showdown.min.js .
mv -v showdown.min.js.map showdown.min.js.map.orig
ln -sv ../../node_modules/showdown/dist/showdown.min.js.map .
popd
echo 'done with work-around'
chown -Rv $ADFICE_USER_NAME:$ADFICE_USER_NAME /home/$ADFICE_USER_NAME
adfice-0.0.0/bin/rhel83-root-setup.sh
adfice-0.0.0/bin/rhel83-root-setup-nginx.sh
su - $ADFICE_USER_NAME \
	-c /home/$ADFICE_USER_NAME/adfice-0.0.0/bin/rhel83-user-setup.sh
