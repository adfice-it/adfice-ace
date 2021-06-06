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
#       https://www.gnu.org/software/make/manual/html_node/Text-Functions.html

SHELL=/bin/bash

default: check

npmsetup:
	npm install
	@echo "$@ complete"

dbsetup: npmsetup
	bin/setup-new-db-container.sh
	bin/load-synthetic-data.sh
	@echo "$@ complete"

check: dbsetup
	npm test adfice
	@echo
	./acceptance-test.sh
	./acceptance-test-cafe.sh
	@echo "SUCCESS $@"

tidy:
	js-beautify --replace --end-with-newline \
		acceptance-test-cafe.js \
		adfice.js \
		adfice.test.js \
		adficeEvaluator.js \
		adficeEvaluator.test.js \
		AdficeWebserver.js \
		static/patient.js \
		adficeUtil.js \
		adficeUtil.test.js \
		verificationAndValidation.test.js \
		ping-db.js
