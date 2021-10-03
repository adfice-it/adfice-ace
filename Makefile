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

SHELL=/bin/bash
ADFICE_VERSION=0.0.0

VM_PORT_SSH := $(shell bin/free-port)
VM_PORT_HTTP := $(shell bin/free-port)
VM_PORT_HTTPS := $(shell bin/free-port)

SSH_MAX_INIT_SECONDS=60
DELAY=0.1
RETRIES=$(shell echo "$(SSH_MAX_INIT_SECONDS)/$(DELAY)" | bc)
KVM_RAM=1G
KVM_CORES=1

default: check


node_modules/ws/lib/websocket-server.js:
	npm install
	@echo "$@ complete"

update:
	npm update

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
BROWSER_JS=\
 static/basic-utils.js \
 static/common.js \
 static/five-pages.js \
 static/footer.js \
 static/patient-header.js \
 static/patient.js

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

check: dbsetup grep-ie-bad-words
	npm test adfice
	@echo
	./acceptance-test.sh
	./acceptance-test-cafe.sh
	./acceptance-test-cafe-new.sh
	@echo "SUCCESS $@"

adfice-ace.tar.gz: \
		acceptance-test-cafe.js \
		acceptance-test-cafe.sh \
		acceptance-test.sh \
		adficeDB.js \
		adficeEvaluator.js \
		adficeEvaluator.test.js \
		adfice.js \
		adfice.test.js \
		adficeUtil.js \
		adficeUtil.test.js \
		AdficeWebserver.js \
		bin/reload-synthetic-data.sh \
		bin/load-synthetic-data.sh \
		bin/make-self-signed-cert.sh \
		bin/reload-patient-data.sh \
		bin/db-create-tables.sh \
		bin/setup-new-db-container.sh \
		bin/connect-container.sh \
		bin/rhel83-root-setup.sh \
		bin/rhel83-root-setup-nginx.sh \
		bin/rhel83-user-setup.sh \
		calculatePrediction.js \
		calculatePrediction.test.js \
		COPYING \
		example.nginx.conf \
		export-to-mrs \
		export-to-mrs.js \
		INSTALL.md \
		Makefile \
		notes \
		package.json \
		ping-db.js \
		portal-export.js \
		prediction \
		system.db-scripts.env \
		README.md \
		sql/createPriority.sql \
		sql/createETLTables.sql \
		sql/insertSynthetic_problems.sql \
		sql/insertSynthetic_measurements.sql \
		sql/newRulesTable.sql \
		sql/populateETLTables.sql \
		sql/insertSynthetic_patient_data_161.sql \
		sql/populateProblemMap.sql \
		sql/insertSynthetic_medications.sql \
		sql/newNonMedTable.sql \
		sql/createPatientTables.sql \
		sql/updateRulesWithSeparatedSelectors.sql \
		sql/newAdviceTable.sql \
		sql/newOtherMedTable.sql \
		sql/insertSynthetic_patient_data_160.sql \
		sql/newPreselectRulesTable.sql \
		sql/insertSynthetic_patient.sql \
		sql/createRulesTable.sql \
		sql/updateMedRulesWithSQLConditions.sql \
		sql/insertSynthetic_labs.sql \
		sql/insertSynthetic_allergies.sql \
		sql/newNonMedHeaders.sql \
		sql/updatePrecheckWithSQLConditions.sql \
		static/HoeGebruikIkDitSysteem.html \
		static/WarningRW_openClipArt.png \
		static/FK_circle_with_linkout.png \
		static/refpages/refpage18.html \
		static/refpages/refpage0.html \
		static/refpages/refpage4.html \
		static/refpages/refpage28.html \
		static/refpages/refpage15.html \
		static/refpages/refpage33.html \
		static/refpages/refpage2.html \
		static/refpages/refpage10.html \
		static/refpages/refpage26.html \
		static/refpages/refpage32.html \
		static/refpages/refpage22.html \
		static/refpages/refpage8.html \
		static/refpages/refpage20.html \
		static/refpages/refpage11.html \
		static/refpages/refpage12.html \
		static/refpages/refpage30.html \
		static/refpages/refpage16.html \
		static/refpages/refpage25.html \
		static/refpages/refpage1.html \
		static/refpages/refpage21.html \
		static/refpages/refpage7.html \
		static/refpages/refpage5.html \
		static/refpages/refpage31.html \
		static/refpages/refpage29.html \
		static/refpages/refPageCurrentMax.txt \
		static/refpages/refpage13.html \
		static/refpages/refstyle.css \
		static/refpages/refpage17.html \
		static/refpages/refpage27.html \
		static/refpages/refpage3.html \
		static/refpages/refpage9.html \
		static/refpages/refpage6.html \
		static/refpages/refpage24.html \
		static/refpages/refpage14.html \
		static/refpages/refpage19.html \
		static/riskScale70.png \
		static/patient.js \
		static/adfice.css \
		static/Advice_IT_logo_small.png \
		testingNotes.txt \
		TODO \
		verificationAndValidation.test.js \
		views/checkboxes.ejs \
		views/index.ejs \
		views/prediction_explanation.ejs \
		views/patient.ejs \
		views/patient-validation.ejs
	tar --transform='s@^@adfice-$(ADFICE_VERSION)/@' \
		--gzip --create --verbose \
		--file=$@ $^

tar: adfice-ace.tar.gz

adfice-user.env:
	echo '# generated by Makefile' > $@
	echo 'ADFICE_USER_NAME=tester' >> $@
	echo 'ADFICE_INSTALL_DIR=/data/webapps/adfice' >> $@
	echo 'ADFICE_TAR_FILE=/home/tester/adfice-ace.tar.gz' >> $@
	echo 'ADFICE_HTTP_PORT=8081' >> $@

centos-vm/basic-centos-8.3-vm.qcow2:
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
	@echo "VM_PORT_SSH: $(VM_PORT_SSH)"
	{ lsof -i:$(VM_PORT_SSH); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_SSH $(VM_PORT_SSH) not free"; false; fi; }
	qemu-img create -f qcow2 -F qcow2 \
		-b basic-centos-8.3-vm.qcow2 \
		tmp-x-vm.qcow2
	@echo 'launching tmp-x-vm.qcow2'
	{ qemu-system-x86_64 -hda tmp-x-vm.qcow2 \
		-m $(KVM_RAM) -smp $(KVM_CORES) -machine type=pc,accel=kvm \
		-display none \
		-nic user,\
hostfwd=tcp:127.0.0.1:$(VM_PORT_SSH)-:22 & \
		echo "$$!" > 'qemu.pid' ; }
	./centos-vm/retry.sh $(RETRIES) $(DELAY) \
		ssh -p$(VM_PORT_SSH) \
			-oNoHostAuthenticationForLocalhost=yes \
			root@127.0.0.1 \
			-i ./centos-vm/id_rsa_tmp \
			'/bin/true'
	ssh-keyscan -p$(VM_PORT_SSH) 127.0.0.1 \
                | grep `cat ./centos-vm/id_rsa_host_tmp.pub | cut -f2 -d' '`
	ssh -p$(VM_PORT_SSH) \
		-oNoHostAuthenticationForLocalhost=yes \
		root@127.0.0.1 \
		-i ./centos-vm/id_rsa_tmp \
		'/bin/true'
	scp -P$(VM_PORT_SSH) \
		-oNoHostAuthenticationForLocalhost=yes \
		-i ./centos-vm/id_rsa_tmp \
		bin/vm-init.sh \
		adfice-ace.tar.gz \
		adfice-user.env \
		root@127.0.0.1:/root/
	ssh -p$(VM_PORT_SSH) \
		-oNoHostAuthenticationForLocalhost=yes \
		root@127.0.0.1 \
		-i ./centos-vm/id_rsa_tmp \
		'bash /root/vm-init.sh'
	ssh -p$(VM_PORT_SSH) \
		-oNoHostAuthenticationForLocalhost=yes \
		root@127.0.0.1 \
		-i ./centos-vm/id_rsa_tmp \
		'shutdown -h -t 2 now & exit'
	{ while kill -0 `cat qemu.pid`; do \
		echo "wating for `cat qemu.pid`"; sleep 1; done }
	sleep 2
	mv -v tmp-x-vm.qcow2 $@

vm-check: adfice-centos-8.3-vm.qcow2
	{ lsof -i:$(VM_PORT_SSH); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_SSH $(VM_PORT_SSH) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTP); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTP $(VM_PORT_HTTP) not free"; false; fi; }
	{ lsof -i:$(VM_PORT_HTTPS); if [ $$? -eq 0 ]; then \
		echo "VM_PORT_HTTPS $(VM_PORT_HTTPS) not free"; false; fi; }
	qemu-img create -f qcow2 -F qcow2 \
		-b basic-centos-8.3-vm.qcow2 \
		tmp-x-vm.qcow2
	@echo 'launching tmp-x-vm.qcow2'
	{ qemu-system-x86_64 -hda tmp-x-vm.qcow2 \
		-m $(KVM_RAM) -smp $(KVM_CORES) -machine type=pc,accel=kvm \
		-display none \
		-nic user,\
hostfwd=tcp:127.0.0.1:$(VM_PORT_HTTPS)-:443,\
hostfwd=tcp:127.0.0.1:$(VM_PORT_HTTP)-:80,\
hostfwd=tcp:127.0.0.1:$(VM_PORT_SSH)-:22 & \
		echo "$$!" > 'qemu.pid' ; }
	./centos-vm/retry.sh $(RETRIES) $(DELAY) \
		ssh -p$(VM_PORT_SSH) \
			-oNoHostAuthenticationForLocalhost=yes \
			root@127.0.0.1 \
			-i ./centos-vm/id_rsa_tmp \
			'/bin/true'
	ssh -p$(VM_PORT_SSH) \
		-oNoHostAuthenticationForLocalhost=yes \
		tester@127.0.0.1 \
		-i ./centos-vm/id_rsa_tmp \
		"bash -c 'cd /data/webapps/adfice; npm test'"
	# Make sure it works before a restart
	./node_modules/.bin/testcafe "firefox:headless" \
		acceptance-test-cafe-new.js https://127.0.0.1:$(VM_PORT_HTTPS)
	## Make sure it works after a restart
	#cd setup-vm && vagrant halt && sleep 2
	#cd setup-vm && vagrant up
	#./node_modules/.bin/testcafe "firefox:headless" \
	#	acceptance-test-cafe.js https://127.0.0.1:8443
	## Make sure it automatically restarts if the service crashes
	#cd setup-vm && vagrant ssh adfice-vm --command \
	#	"bash -c 'ps aux | grep -e Adfice[W]ebserver'"
	#cd setup-vm && vagrant ssh adfice-vm --command "bash -c \"\
	#	kill \$$(ps -aux | grep -e Adfice[W]ebserver | tr -s ' ' \
	#	| cut -d ' ' -f 2)\""
	#sleep 5
	#cd setup-vm && vagrant ssh adfice-vm --command \
	#	"bash -c 'ps aux | grep -e Adfice[W]ebserver'"
	#./node_modules/.bin/testcafe "firefox:headless" \
	#	acceptance-test-cafe.js https://127.0.0.1:8443
	#cd setup-vm && vagrant halt
	@echo "SUCCESS $@"


submodules-update:
	git submodule update --init --recursive

tidy:
	js-beautify --replace --end-with-newline \
		acceptance-test-cafe.js \
		acceptance-test-cafe-new.js \
		adficeDB.js \
		adficeEvaluator.js \
		adficeEvaluator.test.js \
		adfice.js \
		adfice.test.js \
		adficeUtil.js \
		adficeUtil.test.js \
		AdficeWebserver.js \
		bin/free-port.js \
		calculatePrediction.js \
		calculatePrediction.test.js \
		export-to-mrs.js \
		ping-db.js \
		portal-export.js \
		static/*.js \
		verificationAndValidation.test.js
