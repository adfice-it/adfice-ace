default: check

dbsetup:
	./setupdb.sh

check: dbsetup
	npm test adfice

tidy:
	js-beautify -r --end-with-newline \
		adfice.js \
		SandboxEJSWebserver.js \
		testSimpleSelector.js \
		adfice.test.js \
		test1.js

