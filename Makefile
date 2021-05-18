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
#       https://www.gnu.org/software/make/manual/html_node/Text-Functions.html

SHELL=/bin/bash

default: check

npmsetup:
	npm install
	@echo "$@ complete"

dbsetup: npmsetup
	if [ ! -f adfice_mariadb_user_password ]; then \
		echo 'test_data_user_password' > adfice_mariadb_user_password; \
	fi
	if [ ! -f adfice_mariadb_root_password ]; then \
		echo 'test_data_root_password' > adfice_mariadb_root_password; \
	fi
	./setupdb.sh
	@echo "$@ complete"

check: dbsetup
	npm test adfice
	@echo
	./acceptance-test.sh
	@echo "SUCCESS $@"

tidy:
	js-beautify --replace --end-with-newline \
		ping-db.js \
		adfice.js \
		AdficeWebserver.js \
		testSimpleSelector.js \
		adfice.test.js \
		test1.js
