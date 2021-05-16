default: check

dbsetup:
	./setupdb.sh

check: dbsetup
	npm install
	npm test adfice
	@echo
	./acceptance-test.sh
	@echo "SUCCESS $@"

tidy:
	js-beautify -r --end-with-newline \
		adfice.js \
		SandboxEJSWebserver.js \
		testSimpleSelector.js \
		adfice.test.js \
		test1.js

