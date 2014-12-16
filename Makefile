build:
	@./node_modules/.bin/tsc -out ./bin/index.js ./lib/index.ts --module amd -d --sourcemap

test:
	# Exclude situational tests from general run
	@./node_modules/.bin/mocha -u bdd test --recursive -i --grep 'Situational'

.PHONY: test