build:
	@./node_modules/.bin/tsc --module commonjs ./lib/index.ts

test:
	#@./node_modules/.bin/tsc --module commonjs ./lib/index.ts
	@./node_modules/.bin/mocha -u bdd

.PHONY: test