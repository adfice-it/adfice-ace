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
ROCKY_VERSION=rocky-8.7

TEST_BROWSER ?= "firefox:headless"

VM_PORT_SSH := $(shell \
	if [ -z "$${VM_PORT_SSH}" ]; then \
		bin/free-port; \
	else \
		echo "$${VM_PORT_SSH}"; \
	fi \
)
VM_PORT_HTTP := $(shell \
	if [ -z "$${VM_PORT_HTTP}" ]; then \
		bin/free-port; \
	else \
		echo "$${VM_PORT_HTTP}"; \
	fi \
)
VM_PORT_HTTPS := $(shell \
	if [ -z "$${VM_PORT_HTTPS}" ]; then \
		bin/free-port; \
	else \
		echo "$${VM_PORT_HTTPS}"; \
	fi \
)

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
	echo 'enter vm-launch $(1)'
	{ lsof -i:$(VM_PORT_SSH); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_SSH $(VM_PORT_SSH) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTP); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTP $(VM_PORT_HTTP) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTPS); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTPS $(VM_PORT_HTTPS) not free"; false; fi; }
	echo 'launching $(1)'
	{ qemu-system-x86_64 -hda $(1) \
		-display none \
		-m $(KVM_RAM) \
		-smp $(KVM_CORES) \
		-machine type=q35,accel=kvm:tcg \
		-nic $(VM_NIC) & \
		echo "$$!" > '$(1).pid' ; }
	echo "$(VM_NIC)" > '$(1).nic'
	./centos-vm/retry.sh $(RETRIES) $(DELAY) \
		$(VM_SSH) '/bin/true'
	echo "$(VM_SSH)" > '$(1).ssh'
	chmod +x '$(1).ssh'
	ssh-keyscan -p$(VM_PORT_SSH) 127.0.0.1 \
                | grep `cat ./centos-vm/id_rsa_host_tmp.pub | cut -f2 -d' '`
	echo "We are here: $(1)"
	echo -n "$(1).nic: " | cat - $(1).nic
	echo -n "$(1) running, PID: " | cat - $(1).pid
	echo -n "$(1) ssh via: " | cat - $(1).ssh
	echo "exit vm-launch $(1)"
endef

MAX_SLEEP_TO_SHUTDOWN=20
define vm-shutdown
	$(VM_SSH) 'shutdown -h now & exit'
	{ \
	PID=`cat $(1).pid`; \
	COUNT=0; \
	while kill -0 $$PID && [ $$COUNT -lt $(MAX_SLEEP_TO_SHUTDOWN) ]; do \
		echo "$$COUNT waiting for $(1) pid $$PID to terminate"; \
		sleep 1; \
		COUNT=$$(( 1 + $$COUNT )); \
	done; \
	if kill -0 $$PID ; then \
		echo "kill -9 $$PID to terminate with force"; \
		kill -9 $$PID ; \
	fi \
	}
	rm -v $(1).nic $(1).ssh $(1).pid
	sleep 2
endef

default: check


node_modules/.bin/js-beautify:
	npm install
	ls -l $@
	@echo "$@ complete"

node_modules/ws/lib/websocket-server.js:
	npm install
	ls -l $@
	@echo "$@ complete"

node_modules/.bin/testcafe:
	npm install
	ls -l $@
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

BROWSER_JS := $(shell ls static/*js)

check-unit: node_modules/.bin/testcafe dbsetup
	date
	npm test adfice
	date
	@echo "SUCCESS $@"

check: thirdparty check-unit
	date
	./acceptance-test-patient-validation.sh
	date
	./acceptance-test-cafe.sh acceptance-test-basic-start.js
	date
	./acceptance-test-cafe.sh acceptance-test-normal-path.js
	date
	./acceptance-test-cafe.sh acceptance-test-only-once.js
	date
	./acceptance-test-cafe.sh acceptance-test-error-path.js
	date
	@echo "SUCCESS $@"

ADFICE_TAR_CONTENTS=COPYING \
		$(shell ls *.js *.sh) \
		example.nginx.conf \
		INSTALL.md \
		Makefile \
		Makefile.basic \
		notes \
		package.json \
		README.md \
		static/thirdparty/showdown.min.js \
		static/thirdparty/showdown.min.js.map \
		$(shell find bin sql static views -type f) \
		$(shell find static views -type l) \
		system.db-scripts.env \
		system.portal-db-scripts.env \
		testingNotes.txt \
		$(shell ls *etl-options.json) \
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

centos-vm/basic-$(ROCKY_VERSION)-vm.qcow2: centos-vm/Makefile
	@echo "begin $@"
	pushd centos-vm \
		&& make basic-$(ROCKY_VERSION)-vm.qcow2 \
		&& popd
	@echo "SUCCESS $@"

basic-$(ROCKY_VERSION)-vm.qcow2: centos-vm/basic-$(ROCKY_VERSION)-vm.qcow2
	@echo "begin $@"
	cp -v centos-vm/basic-$(ROCKY_VERSION)-vm.qcow2 basic-$(ROCKY_VERSION)-vm.qcow2
	chmod -v a-w basic-$(ROCKY_VERSION)-vm.qcow2
	@echo "SUCCESS $@"

adfice-$(ROCKY_VERSION)-vm.qcow2: basic-$(ROCKY_VERSION)-vm.qcow2 \
		bin/vm-init.sh \
		adfice-ace.tar.gz \
		adfice-user.env
	qemu-img create -f qcow2 -F qcow2 \
		-b basic-$(ROCKY_VERSION)-vm.qcow2 \
		tmp-x-vm.qcow2
	$(call vm-launch,tmp-x-vm.qcow2)
	$(VM_SCP) bin/vm-init.sh \
		adfice-ace.tar.gz \
		adfice-user.env \
		root@127.0.0.1:/root/
	$(VM_SSH) 'bash /root/vm-init.sh'
	$(call vm-shutdown,tmp-x-vm.qcow2)
	mv -v tmp-x-vm.qcow2 $@

vm-check: adfice-$(ROCKY_VERSION)-vm.qcow2 node_modules/.bin/testcafe
	date
	qemu-img create -f qcow2 -F qcow2 \
		-b adfice-$(ROCKY_VERSION)-vm.qcow2 \
		test-adfice-$(ROCKY_VERSION)-vm.qcow2
	date
	$(call vm-launch,test-adfice-$(ROCKY_VERSION)-vm.qcow2)
	date
	$(VM_SSH_ADFICE) "bash -c 'cd /data/webapps/adfice; npm test'"
	date
	@echo "Make sure it works before a restart"
	date
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-basic-start.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	date
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-normal-path.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	date
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-only-once.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	date
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-error-path.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	date
	@echo
	@echo
	@echo "shutting down, to Make sure it works after a restart"
	$(call vm-shutdown,test-adfice-$(ROCKY_VERSION)-vm.qcow2)
	date
	@echo
	@echo 'launch #2 test-adfice-$(ROCKY_VERSION)-vm.qcow2'
	@echo
	$(call vm-launch,test-adfice-$(ROCKY_VERSION)-vm.qcow2)
	date
	@echo "Make sure it works after a restart"
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-basic-start.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	@echo
	date
	@echo "Make sure it automatically restarts if the service crashes"
	$(VM_SSH) "bash -c 'ps aux | grep -e adfice-[w]ebserver'"
	$(VM_SSH) "bash -c \"\
		kill \$$(ps -aux | grep -e adfice-[w]ebserver | tr -s ' ' \
		| cut -d ' ' -f 2)\""
	sleep 20
	$(VM_SSH) "bash -c 'ps aux | grep -e adfice-[w]ebserver'"
	./node_modules/.bin/testcafe $(TEST_BROWSER) \
		acceptance-test-basic-start.js \
		https://127.0.0.1:$(VM_PORT_HTTPS)
	$(call vm-shutdown,test-adfice-$(ROCKY_VERSION)-vm.qcow2)
	date
	@echo "SUCCESS $@"

submodules-update:
	git submodule update --init --recursive
	@echo "SUCCESS $@"

centos-vm/Makefile: submodules-update
	ls -l centos-vm/Makefile
	@echo "SUCCESS $@"

tidy: node_modules/.bin/js-beautify
	node_modules/.bin/js-beautify --replace --end-with-newline \
		*.js \
		bin/*.js \
		static/*.js

jest:
	@echo 'This target skips the npm and dbsetup'
	@echo 'if this fails, consider "make check"'
	npm test adfice
	@echo "SUCCESS $@"

clean:
	rm -rfv *qcow2* *.tar.*
