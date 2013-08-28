
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test: node_modules
	@./node_modules/.bin/mocha -R spec

node_modules:
	@npm install

.PHONY: clean test
