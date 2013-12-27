TESTFLAGS = --reporter spec
TESTS = test/*.js

test: node_modules
		@./node_modules/.bin/mocha $(TESTFLAGS) $(TESTS)

node_modules:
	@npm install --dev
.PHONY: test