build:
	@tsc -out ./bin/index.js ./lib/index.ts --module amd -d --sourcemap

test:
	@./node_modules/.bin/mocha -u bdd

.PHONY: test