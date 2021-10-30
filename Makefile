# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
#
# Makefile cheat-sheet:
#
# $@ : target label
# $< : the first prerequisite after the colon
# $^ : all of the prerequisite files
# $* : wildcard matched part
#
# Target-specific Variable syntax:
# https://www.gnu.org/software/make/manual/html_node/Target_002dspecific.html
#
# patsubst : $(patsubst pattern,replacement,text)
#	https://www.gnu.org/software/make/manual/html_node/Text-Functions.html
# call : $(call func,param1,param2,...)
#	https://www.gnu.org/software/make/manual/html_node/Call-Function.html
# define :
#	https://www.gnu.org/software/make/manual/html_node/Multi_002dLine.html

SHELL=/bin/bash
ADFICE_VERSION=0.0.0

VM_PORT_SSH := $(shell bin/free-port)
VM_PORT_HTTP := $(shell bin/free-port)
VM_PORT_HTTPS := $(shell bin/free-port)

SSH_PARAMS=-oNoHostAuthenticationForLocalhost=yes \
	   -i ./centos-vm/id_rsa_tmp

define vm-ssh
	ssh -p$(VM_PORT_SSH) $(SSH_PARAMS) $(1)@127.0.0.1
endef

VM_SSH=$(call vm-ssh,root)

VM_SSH_ADFICE=$(call vm-ssh,adfice)

VM_SCP=scp -P$(VM_PORT_SSH) $(SSH_PARAMS)

SSH_MAX_INIT_SECONDS=60
DELAY=0.1
RETRIES=$(shell echo "$(SSH_MAX_INIT_SECONDS)/$(DELAY)" | bc)
KVM_RAM=1G
KVM_CORES=1

VM_NIC=$(shell echo 'user \
	hostfwd=tcp:127.0.0.1:$(VM_PORT_HTTPS)-:443 \
	hostfwd=tcp:127.0.0.1:$(VM_PORT_HTTP)-:80 \
	hostfwd=tcp:127.0.0.1:$(VM_PORT_SSH)-:22' \
	| sed -e's/\s\s*/,/g')

define vm-launch
	{ lsof -i:$(VM_PORT_SSH); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_SSH $(VM_PORT_SSH) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTP); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTP $(VM_PORT_HTTP) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTPS); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTPS $(VM_PORT_HTTPS) not free"; false; fi; }
	@echo 'launching $(1)'
	{ qemu-system-x86_64 -hda $(1) \
		-m $(KVM_RAM) \
		-smp $(KVM_CORES) \
		-machine type=pc,accel=kvm \
		-display none \
		-nic $(VM_NIC) & \
		echo "$$!" > '$(1).pid' ; }
	echo "$(VM_NIC)" > '$(1).nic'
	./centos-vm/retry.sh $(RETRIES) $(DELAY) \
		$(VM_SSH) '/bin/true'
	echo "$(VM_SSH)" > '$(1).ssh'
	chmod +x '$(1).ssh'
	ssh-keyscan -p$(VM_PORT_SSH) 127.0.0.1 \
                | grep `cat ./centos-vm/id_rsa_host_tmp.pub | cut -f2 -d' '`
	@echo "$(1).nic: $(shell cat $(1).nic)"
	@echo '$(1) running, PID: $(shell cat $(1).pid)'
	@echo '$(1) ssh via: $(shell cat $(1).ssh)'
endef

define vm-shutdown
	$(VM_SSH) 'shutdown -h -t 2 now & exit'
	{ while kill -0 `cat $(1).pid`; do \
		echo "wating for $(1) pid `cat $(1).pid` to terminate"; \
		sleep 1; done }
	rm -v $(1).nic $(1).ssh $(1).pid
	sleep 2
endef

default: check


node_modules/ws/lib/websocket-server.js:
	npm install
	ls -l node_modules/ws/lib/websocket-server.js
	@echo "$@ complete"

node_modules/.bin/testcafe:
	npm install
	ls -l node_modules/.bin/testcafe
	@echo "$@ complete"

node_modules/showdown/dist/showdown.min.js: node_modules/.bin/testcafe
	ls -l $@
	@echo "$@ complete"

node_modules/showdown/dist/showdown.min.js.map: node_modules/.bin/testcafe
	ls -l $@
	@echo "$@ complete"

static/thirdparty:
	mkdir -pv static/thirdparty
	ls -ld static/thirdparty
	@echo "$@ complete"

static/thirdparty/showdown.min.js: static/thirdparty \
		node_modules/showdown/dist/showdown.min.js
	cp -v node_modules/showdown/dist/showdown.min.js static/thirdparty/
	ls -l $@

static/thirdparty/showdown.min.js.map: static/thirdparty \
		node_modules/showdown/dist/showdown.min.js.map
	cp -v node_modules/showdown/dist/showdown.min.js.map static/thirdparty/
	ls -l $@

thirdparty: node_modules/ws/lib/websocket-server.js \
		static/thirdparty/showdown.min.js \
		static/thirdparty/showdown.min.js.map
	@echo "$@ complete"

update:
	npm update
	@echo "$@ complete"

npmsetup: node_modules/ws/lib/websocket-server.js
	@echo "$@ complete"

db-scripts.env:
	ln -sv docker.db-scripts.env db-scripts.env

portal-db-scripts.env:
	ln -sv docker.portal-db-scripts.env portal-db-scripts.env

adfice-dbsetup: npmsetup db-scripts.env
	bin/setup-new-db-container.sh docker.db-scripts.env
	bin/db-create-tables.sh db-scripts.env
	bin/load-synthetic-data.sh db-scripts.env
	@echo "$@ complete"

portal-dbsetup: npmsetup portal-db-scripts.env
	bin/setup-new-db-container.sh docker.portal-db-scripts.env
	bin/db-create-portal-tables.sh portal-db-scripts.env
	@echo "$@ complete"

dbsetup: adfice-dbsetup portal-dbsetup

IE_BADWORDS_RE='await\|async\|forEach\|=>\|'\`
BROWSER_JS := $(shell ls static/*js)

grep-ie-bad-words: $(BROWSER_JS)
	for FILE in $(BROWSER_JS); do \
		if [ $$(grep -c $(IE_BADWORDS_RE) $$FILE ) -eq 0 ]; then \
			true; \
		else \
			echo $$FILE; \
			grep $(IE_BADWORDS_RE) $$FILE; \
			exit 1; \
		fi; \
	done
	@echo "$@ complete"

check-unit: dbsetup grep-ie-bad-words
	npm test adfice
	@echo "SUCCESS $@"

check: thirdparty check-unit
	./acceptance-test-patient-validation.sh
	./acceptance-test-cafe-new.sh
	@echo "SUCCESS $@"

ADFICE_TAR_CONTENTS=COPYING \
		$(shell ls *.js *.sh) \
		example.nginx.conf \
		export-to-mrs \
		INSTALL.md \
		Makefile \
		notes \
		package.json \
		README.md \
		$(shell find bin prediction sql static views -type f) \
		$(shell find static views -type l) \
		system.db-scripts.env \
		testingNotes.txt \
		TODO

# transform fails to do something sensible with symbolic links
# for the moment, hack around this with bin/vm-init
adfice-ace.tar.gz: $(ADFICE_TAR_CONTENTS)
	tar --transform='s@^@adfice-$(ADFICE_VERSION)/@' \
		--gzip --create --verbose \
		--file=$@ $^
	ls -l $@

tar: adfice-ace.tar.gz

adfice-user.env:
	echo '# generated by Makefile' > $@
	echo 'ADFICE_USER_NAME=adfice' >> $@
	echo 'ADFICE_INSTALL_DIR=/data/webapps/adfice' >> $@
	echo 'ADFICE_TAR_FILE=/home/adfice/adfice-ace.tar.gz' >> $@
	echo 'ADFICE_HTTP_PORT=8081' >> $@

centos-vm/basic-centos-8.3-vm.qcow2: centos-vm/Makefile
	@echo "begin $@"
	pushd centos-vm \
		&& make basic-centos-8.3-vm.qcow2 \
		&& popd
	@echo "SUCCESS $@"

basic-centos-8.3-vm.qcow2: centos-vm/basic-centos-8.3-vm.qcow2
	@echo "begin $@"
	cp -v centos-vm/basic-centos-8.3-vm.qcow2 basic-centos-8.3-vm.qcow2
	chmod -v a-w basic-centos-8.3-vm.qcow2
	@echo "SUCCESS $@"

adfice-centos-8.3-vm.qcow2: basic-centos-8.3-vm.qcow2 \
		bin/vm-init.sh \
		adfice-ace.tar.gz \
		adfice-user.env
	qemu-img create -f qcow2 -F qcow2 \
		-b basic-centos-8.3-vm.qcow2 \
		tmp-x-vm.qcow2
	$(call vm-launch,tmp-x-vm.qcow2)
	$(VM_SCP) bin/vm-init.sh \
		adfice-ace.tar.gz \
		adfice-user.env \
		root@127.0.0.1:/root/
	$(VM_SSH) 'bash /root/vm-init.sh'
	$(call vm-shutdown,tmp-x-vm.qcow2)
	mv -v tmp-x-vm.qcow2 $@

vm-check: adfice-centos-8.3-vm.qcow2 node_modules/.bin/testcafe
	qemu-img create -f qcow2 -F qcow2 \
		-b adfice-centos-8.3-vm.qcow2 \
		test-adfice-centos-8.3-vm.qcow2
	$(call vm-launch,test-adfice-centos-8.3-vm.qcow2)
	$(VM_SSH_ADFICE) "bash -c 'cd /data/webapps/adfice; npm test'"
	@echo "Make sure it works before a restart"
	./node_modules/.bin/testcafe "firefox:headless" \
		acceptance-test-cafe-new.js https://127.0.0.1:$(VM_PORT_HTTPS)
	@echo
	@echo "shutting down, to Make sure it works after a restart"
	$(call vm-shutdown,test-adfice-centos-8.3-vm.qcow2)
	@echo
	@echo 'launch #2 test-adfice-centos-8.3-vm.qcow2'
	@echo
	$(call vm-launch,test-adfice-centos-8.3-vm.qcow2)
	@echo "Make sure it works after a restart"
	./node_modules/.bin/testcafe "firefox:headless" \
		acceptance-test-cafe-new.js https://127.0.0.1:$(VM_PORT_HTTPS)
	@echo
	@echo "Make sure it automatically restarts if the service crashes"
	$(VM_SSH) "bash -c 'ps aux | grep -e Adfice[W]ebserver'"
	$(VM_SSH) "bash -c \"\
		kill \$$(ps -aux | grep -e Adfice[W]ebserver | tr -s ' ' \
		| cut -d ' ' -f 2)\""
	sleep 5
	$(VM_SSH) "bash -c 'ps aux | grep -e Adfice[W]ebserver'"
	./node_modules/.bin/testcafe "firefox:headless" \
		acceptance-test-cafe-new.js https://127.0.0.1:$(VM_PORT_HTTPS)
	$(call vm-shutdown,test-adfice-centos-8.3-vm.qcow2)
	@echo "SUCCESS $@"

submodules-update:
	git submodule update --init --recursive
	@echo "SUCCESS $@"

centos-vm/Makefile: submodules-update
	ls -l centos-vm/Makefile
	@echo "SUCCESS $@"

tidy:
	js-beautify --replace --end-with-newline \
		*.js \
		bin/*.js \
		static/*.js

jest:
	@echo 'This target skips the npm and dbsetup'
	@echo 'if this fails, consider "make check"'
	npm test adfice
	@echo "SUCCESS $@"
