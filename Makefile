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
	./setupdb.sh
	@echo "$@ complete"

check: dbsetup
	npm test adfice
	@echo
	./acceptance-test.sh
	@echo "SUCCESS $@"

tidy:
	js-beautify -r --end-with-newline \
		ping-db.js \
		adfice.js \
		AdficeWebserver.js \
		testSimpleSelector.js \
		adfice.test.js \
		test1.js
