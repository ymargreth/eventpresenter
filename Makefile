# detect which compose command is available

COMPOSE_BIN := $(shell \
	if docker compose version >/dev/null 2>&1; then \
		echo "docker compose"; \
	elif docker-compose version >/dev/null 2>&1; then \
		echo "docker-compose"; \
	else \
		echo "NONE"; \
	fi)

ifeq ($(COMPOSE_BIN),NONE)
$(error Neither 'docker compose' nor 'docker-compose' is available)
endif

# =========================
# CONFIG
# =========================

DOCKER        ?= docker
COMPOSE       ?= $(COMPOSE_BIN)
PROJECT       ?= eventpresenter
FILE          ?= docker-compose.yml
SERVICE       ?=           # optional: SERVICE=web

# common flags
COMPOSE_CMD = $(COMPOSE) -f $(FILE) -p $(PROJECT)

all: start

# =========================
# COMMANDS
# =========================

.PHONY: up down pause stop
pause: stop
up down stop: check-docker
	@$(COMPOSE_CMD) $@ $(SERVICE)

.PHONY: start run
start: run
run: check-docker
	@$(COMPOSE_CMD) up -d $(SERVICE)

.PHONY: reset
reset: down run

.PHONY: rebuild
rebuild: down
	@$(COMPOSE_CMD) up -d --build $(SERVICE)

.PHONY: logs
logs:s
	@$(COMPOSE_CMD) logs -f $(SERVICE)

.PHONY: ps status
status: ps
ps:
	@$(COMPOSE_CMD) ps

.PHONY: clean
clean:
	@$(COMPOSE_CMD) down -v --remove-orphans


.PHONY: check-docker
check-docker:
	@if ! $(DOCKER) info > /dev/null 2>&1; then \
		open -a Docker; \
		while ! $(DOCKER) info > /dev/null 2>&1; do sleep 2; done; \
	fi

# =========================
# HELP
# =========================

.PHONY: help sense
sense: help
help:
	@echo ""
	@echo "Event Presenter - Docker Compose Makefile"
	@echo "=============================="
	@echo ""
	@echo "Usage Examples:"
	@echo "  > make up"
	@echo "  // start in foreground (Ctrl+C to stop)"
	@echo ""
	@echo "  > make start SERVICE=web"
	@echo "  // start in background (detached mode)"
	@echo ""
	@echo "  > make pause"
	@echo "  // pause the running containers"
	@echo ""
	@echo "Optional Variables:"
	@echo "  SERVICE=<name>   (target specific service)"
	@echo ""