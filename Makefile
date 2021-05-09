check:
	./setupdb.sh

tidy:
	js-beautify -r --end-with-newline test1.js
