.PHONY: test
default: help

# Perl Colors, with fallback if tput command not available
GREEN  := $(shell command -v tput >/dev/null 2>&1 && tput -Txterm setaf 2 || echo "")
BLUE   := $(shell command -v tput >/dev/null 2>&1 && tput -Txterm setaf 4 || echo "")
WHITE  := $(shell command -v tput >/dev/null 2>&1 && tput -Txterm setaf 7 || echo "")
YELLOW := $(shell command -v tput >/dev/null 2>&1 && tput -Txterm setaf 3 || echo "")
RESET  := $(shell command -v tput >/dev/null 2>&1 && tput -Txterm sgr0 || echo "")

project_root=--project-root .

# Add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_FUN = \
    %help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
    print "usage: make [target]\n\n"; \
    for (sort keys %help) { \
    print "${WHITE}$$_:${RESET}\n"; \
    for (@{$$help{$$_}}) { \
    $$sep = " " x (32 - length $$_->[0]); \
    print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
    }; \
    print "\n"; }

NPM=npm --silent --prefix ./scripts

help:
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)

setup: ##@Setup - ENV variables
	@echo 'export STARKNET_NETWORK=alpha-goerli' >> ~/.bashrc
	@echo 'export STARKNET_WALLET=starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount' >> ~/.bashrc

install: ##@Setup - Install dependencies
	@if [ ! -f ./.env ]; then cp .env.dist .env ; fi
	@$(NPM) i

clean: ##@Setup - Remove dependencies
	@if [ -d ./scripts/node_modules ]; then rm -rf ./scripts/node_modules ; fi

compile: ##@Contracts - Compile Cairo contracts (anchoring and factory) 
	@scarb build

test: ##@Contracts - Run tests
	@scarb test

sandbox-start: ##@Sandbox - Start starknet-devnet sandbox
	docker run -p 5050:5050 shardlabs/starknet-devnet --seed 0

declare-factory: ##@Scripts - Generate a Factory contract
	@$(NPM) run declare:factory

declare-anchoring: ##@Scripts - Generate a Anchoring contract
	@$(NPM) run declare:anchoring

deploy-factory: ##@Scripts - Generate a Factory contract (FACTORY_CLASS_HASH=0x77ddf272479f55dd022e925e0f53aa31f3cab2afc1491edf700babed6befa80)
	@$(NPM) run deploy:factory $(FACTORY_CLASS_HASH)

generate-anchoring: ##@Scripts - Invoke the Factory contract to generate a new Anchoring contract (make generate-anchoring ANCHORING_ADMIN=0x021B328153B45744778795F5C8edd9211da72fca894ef91Ea389C479A31f1449)
	@$(NPM) run generate:anchoring

view-factory: ##@Scripts - Invoke the Factory contract to retrieve storage information
	@$(NPM) run factory:view

anchor-message: ##@Scripts - Generate a Anchor contract (make anchor-message MSG=toto ANCHORING=0x123123123123123 )
	@$(NPM) run anchoring:anchor '$(MSG)' $(ANCHORING)

