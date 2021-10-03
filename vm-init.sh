adduser -U tester
cp -rv /root/.ssh /home/tester
mv -v /root/adfice-user.env /home/tester
mv -v /root/adfice-ace.tar.gz /home/tester
cd /home/tester
tar xvf adfice-ace.tar.gz
chown -Rv tester:tester /home/tester
adfice-0.0.0/bin/rhel83-root-setup.sh
adfice-0.0.0/bin/rhel83-root-setup-nginx.sh
su - tester -c /home/tester/adfice-0.0.0/bin/rhel83-user-setup.sh
