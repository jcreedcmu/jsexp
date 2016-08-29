all:
	node parse.js input.txt > parse2.js
	node parse2.js input.txt > parse3.js
	node parse3.js input.txt > parse4.js
	cat parse4.js
	diff parse3.js parse4.js

good:
	cp parse3.js parse.js
